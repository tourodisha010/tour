from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

import os
import uuid
import logging
import bcrypt
import jwt
from datetime import datetime, timezone, timedelta
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends, status
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr, ConfigDict


# -------------------- Setup --------------------
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_ALGORITHM = "HS256"
JWT_ACCESS_TTL_MIN = 60 * 12  # 12 hours

app = FastAPI(title="Explore Odisha API")
api_router = APIRouter(prefix="/api")

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("explore-odisha")


# -------------------- Auth helpers --------------------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]


def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=JWT_ACCESS_TTL_MIN),
        "type": "access",
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)


async def get_current_admin(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        if user.get("role") != "admin":
            raise HTTPException(status_code=403, detail="Admin access required")
        user.pop("password_hash", None)
        user.pop("_id", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# -------------------- Models --------------------
class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


class InquiryCreate(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(min_length=6, max_length=20)
    package: Optional[str] = None
    travel_date: Optional[str] = None
    guests: Optional[int] = Field(default=1, ge=1, le=50)
    message: Optional[str] = Field(default="", max_length=2000)


class Inquiry(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    package: Optional[str] = None
    travel_date: Optional[str] = None
    guests: Optional[int] = 1
    message: str
    status: str = "new"
    created_at: str


class InquiryStatusUpdate(BaseModel):
    status: str  # new | contacted | booked | closed


class Package(BaseModel):
    id: str
    slug: str
    title: str
    subtitle: str
    duration: str
    price_from: int
    image_url: str
    description: str
    highlights: List[str]
    featured: bool = False


class Testimonial(BaseModel):
    id: str
    name: str
    location: str
    quote: str
    rating: int = 5


class BlogPost(BaseModel):
    id: str
    slug: str
    title: str
    excerpt: str
    image_url: str
    author: str
    published_at: str


# -------------------- Public routes --------------------
@api_router.get("/")
async def root():
    return {"message": "Explore Odisha API", "status": "ok"}


@api_router.get("/packages", response_model=List[Package])
async def list_packages():
    items = await db.packages.find({}, {"_id": 0}).sort("featured", -1).to_list(100)
    return items


@api_router.get("/packages/{slug}", response_model=Package)
async def get_package(slug: str):
    item = await db.packages.find_one({"slug": slug}, {"_id": 0})
    if not item:
        raise HTTPException(status_code=404, detail="Package not found")
    return item


@api_router.get("/testimonials", response_model=List[Testimonial])
async def list_testimonials():
    items = await db.testimonials.find({}, {"_id": 0}).to_list(100)
    return items


@api_router.get("/blog", response_model=List[BlogPost])
async def list_blog():
    items = await db.blog.find({}, {"_id": 0}).sort("published_at", -1).to_list(100)
    return items


@api_router.post("/inquiries", response_model=Inquiry, status_code=201)
async def create_inquiry(payload: InquiryCreate):
    doc = payload.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["status"] = "new"
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.inquiries.insert_one(doc)
    doc.pop("_id", None)
    logger.info(f"New inquiry from {payload.email}")
    return doc


# -------------------- Auth routes --------------------
@api_router.post("/auth/login", response_model=LoginResponse)
async def login(payload: LoginRequest):
    email = payload.email.lower().strip()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"], user["role"])
    return LoginResponse(
        access_token=token,
        user={"id": user["id"], "email": user["email"], "name": user.get("name", "Admin"), "role": user["role"]},
    )


@api_router.get("/auth/me")
async def me(admin: dict = Depends(get_current_admin)):
    return admin


# -------------------- Admin routes --------------------
@api_router.get("/admin/inquiries", response_model=List[Inquiry])
async def admin_list_inquiries(admin: dict = Depends(get_current_admin), status_filter: Optional[str] = None):
    query = {}
    if status_filter and status_filter != "all":
        query["status"] = status_filter
    items = await db.inquiries.find(query, {"_id": 0}).sort("created_at", -1).to_list(500)
    return items


@api_router.patch("/admin/inquiries/{inquiry_id}", response_model=Inquiry)
async def admin_update_inquiry(inquiry_id: str, payload: InquiryStatusUpdate, admin: dict = Depends(get_current_admin)):
    if payload.status not in ("new", "contacted", "booked", "closed"):
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.inquiries.find_one_and_update(
        {"id": inquiry_id},
        {"$set": {"status": payload.status}},
        return_document=True,
        projection={"_id": 0},
    )
    if not result:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return result


@api_router.delete("/admin/inquiries/{inquiry_id}")
async def admin_delete_inquiry(inquiry_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.inquiries.delete_one({"id": inquiry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    return {"deleted": True}


@api_router.get("/admin/stats")
async def admin_stats(admin: dict = Depends(get_current_admin)):
    total = await db.inquiries.count_documents({})
    new_count = await db.inquiries.count_documents({"status": "new"})
    contacted = await db.inquiries.count_documents({"status": "contacted"})
    booked = await db.inquiries.count_documents({"status": "booked"})
    return {"total": total, "new": new_count, "contacted": contacted, "booked": booked}


# -------------------- Seed data --------------------
SEED_PACKAGES = [
    {
        "slug": "golden-triangle",
        "title": "The Golden Triangle",
        "subtitle": "Bhubaneshwar · Puri · Konark",
        "duration": "5 Days · 4 Nights",
        "price_from": 18500,
        "image_url": "https://images.pexels.com/photos/20371128/pexels-photo-20371128.jpeg",
        "description": "Trace the spiritual and architectural heart of Odisha through the sacred trio — temple-city Bhubaneshwar, Lord Jagannath's Puri, and the majestic Sun Temple of Konark.",
        "highlights": ["Lingaraj & Mukteshwar Temples", "Sunrise at Konark", "Puri Rath route walk", "Beachside evenings", "Local Odia thali experience"],
        "featured": True,
    },
    {
        "slug": "chilika-lagoon",
        "title": "Whispers of Chilika",
        "subtitle": "Asia's Largest Brackish Lagoon",
        "duration": "3 Days · 2 Nights",
        "price_from": 11200,
        "image_url": "https://images.unsplash.com/photo-1618843808465-befb4ad4a183",
        "description": "Drift across pastel dawns with Irrawaddy dolphins, migratory birds, and fishermen who read the water like scripture.",
        "highlights": ["Dolphin sighting boat safari", "Satapada & Nalabana bird island", "Kalijai temple visit", "Fresh crab & pomfret feasts"],
        "featured": True,
    },
    {
        "slug": "tribal-circuit",
        "title": "The Tribal Trail",
        "subtitle": "Koraput · Jeypore · Onukudelli",
        "duration": "7 Days · 6 Nights",
        "price_from": 32900,
        "image_url": "https://images.unsplash.com/photo-1724521260101-c13e61992638",
        "description": "Meet the Bonda, Dongria Kondh and Paraja communities of the Eastern Ghats — a journey led by locals, into weekly haats, weaving villages, and forest shrines.",
        "highlights": ["Weekly tribal markets", "Dhokra & ikat workshops", "Duduma waterfall trek", "Homestay with tribal families"],
        "featured": True,
    },
    {
        "slug": "bhitarkanika",
        "title": "Bhitarkanika Wilderness",
        "subtitle": "Mangroves · Crocodiles · Coast",
        "duration": "4 Days · 3 Nights",
        "price_from": 15800,
        "image_url": "https://images.pexels.com/photos/38128176/pexels-photo-38128176.jpeg",
        "description": "Glide through mangrove creeks, spot saltwater crocodiles basking on mudflats, and witness Olive Ridley turtles at Gahirmatha.",
        "highlights": ["Guided boat safaris", "Gahirmatha turtle beach", "Salt-marsh birding", "Fishing hamlet lunch"],
        "featured": False,
    },
    {
        "slug": "similipal",
        "title": "Similipal Forest Retreat",
        "subtitle": "Mayurbhanj Highlands",
        "duration": "5 Days · 4 Nights",
        "price_from": 21400,
        "image_url": "https://images.pexels.com/photos/15678073/pexels-photo-15678073.jpeg",
        "description": "Sal forests, tumbling waterfalls, and the elusive melanistic tiger — Similipal is Odisha's wildest secret, home also to the Santhal and Ho tribes.",
        "highlights": ["Barehipani & Joranda falls", "Jeep safaris", "Santhal village walk", "Bonfire nights"],
        "featured": False,
    },
    {
        "slug": "buddhist-trail",
        "title": "The Buddhist Diamond Triangle",
        "subtitle": "Ratnagiri · Udayagiri · Lalitgiri",
        "duration": "3 Days · 2 Nights",
        "price_from": 9800,
        "image_url": "https://images.pexels.com/photos/10317127/pexels-photo-10317127.jpeg",
        "description": "Uncover a lesser-known chapter of Buddhism — hilltop stupas, monastic ruins and a serene Buddha relic casket in the mist-fed Assia hills.",
        "highlights": ["Ratnagiri museum", "Lalitgiri stupa climb", "Udayagiri excavations", "Silence meditation session"],
        "featured": False,
    },
]

SEED_TESTIMONIALS = [
    {"name": "Ananya Rao", "location": "Bengaluru", "quote": "The tribal trail was the most humbling week of our lives. Our guide made us feel like we were visiting family, not tourists.", "rating": 5},
    {"name": "Marc Dubois", "location": "Paris, France", "quote": "Chilika at dawn is a memory I keep returning to. Explore Odisha planned every detail with quiet elegance.", "rating": 5},
    {"name": "Ritika Sharma", "location": "New Delhi", "quote": "From the food to the homestays to the storytelling — this is how travel is supposed to feel. Rooted, real, unforgettable.", "rating": 5},
    {"name": "Yuki Tanaka", "location": "Kyoto, Japan", "quote": "I came for Konark. I left with friendships, an ikat saree, and a promise to return in monsoon.", "rating": 5},
]

SEED_BLOG = [
    {
        "slug": "monsoon-in-koraput",
        "title": "A Monsoon Morning in Koraput",
        "excerpt": "When the Eastern Ghats disappear into mist, weekly haats become theatres of colour, sound and memory.",
        "image_url": "https://images.unsplash.com/photo-1724521260101-c13e61992638",
        "author": "Sanjukta Mishra",
        "published_at": "2025-08-14",
    },
    {
        "slug": "reading-konark",
        "title": "Reading Konark: The Sun Temple as Manuscript",
        "excerpt": "Every stone at Konark is a paragraph. We spend an afternoon translating just three of them.",
        "image_url": "https://images.pexels.com/photos/32331079/pexels-photo-32331079.jpeg",
        "author": "Debasish Patra",
        "published_at": "2025-09-02",
    },
    {
        "slug": "chilika-dolphins",
        "title": "The Fisherfolk & the Dolphins of Chilika",
        "excerpt": "For centuries, Chilika's fishermen and Irrawaddy dolphins have shared the lagoon — a partnership older than any treaty.",
        "image_url": "https://images.unsplash.com/photo-1618843808465-befb4ad4a183",
        "author": "Priya Nayak",
        "published_at": "2025-10-19",
    },
]


async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@exploreodisha.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "Admin@123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Seeded admin user {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )
        logger.info(f"Updated admin password for {admin_email}")


async def seed_content():
    if await db.packages.count_documents({}) == 0:
        docs = []
        for p in SEED_PACKAGES:
            d = dict(p)
            d["id"] = str(uuid.uuid4())
            docs.append(d)
        await db.packages.insert_many(docs)
        logger.info(f"Seeded {len(docs)} packages")
    if await db.testimonials.count_documents({}) == 0:
        docs = [{**t, "id": str(uuid.uuid4())} for t in SEED_TESTIMONIALS]
        await db.testimonials.insert_many(docs)
    if await db.blog.count_documents({}) == 0:
        docs = [{**b, "id": str(uuid.uuid4())} for b in SEED_BLOG]
        await db.blog.insert_many(docs)


@app.on_event("startup")
async def on_startup():
    try:
        await db.users.create_index("email", unique=True)
        await db.inquiries.create_index("created_at")
        await db.packages.create_index("slug", unique=True)
        await seed_admin()
        await seed_content()
    except Exception as e:
        logger.error(f"Startup error: {e}")


@app.on_event("shutdown")
async def on_shutdown():
    client.close()


# -------------------- App wiring --------------------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)
