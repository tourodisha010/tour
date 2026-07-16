# Explore Odisha — Product Requirements

## Original Problem Statement
"built me a modern and yet classic website for my travel company which provides serves in odisha only, give it a locol touch and make it look authentic and appealing"

## Company
- Name: Tour Odisha
- Email: etourodisha101@gmail.com
- Phone: 7077006689
- Location: Bhubaneshwar, Odisha
- Design vibe: Earthy & authentic — terracotta, indigo, temple-stone, Pattachitra motifs

## Personas
- Traveller (public visitor exploring packages, submitting inquiries)
- Admin (Explore Odisha team viewing/managing inquiries)

## Core Requirements
1. Landing page: Hero, About, Featured Packages, Destinations Gallery, Testimonials, Blog snippets, Contact/Inquiry form, Footer
2. Booking/Inquiry form → captured in MongoDB
3. Admin login (JWT) → protected dashboard to view/filter/update-status/delete inquiries
4. No third-party integrations for MVP

## What's Been Implemented (2026-07)
- FastAPI backend with /api/packages, /api/testimonials, /api/blog, /api/inquiries (public)
- Admin auth: /api/auth/login, /api/auth/me, /api/admin/inquiries (GET/PATCH/DELETE), /api/admin/stats
- MongoDB seeding: 6 packages, 4 testimonials, 3 blog posts, admin user
- Bcrypt password hashing + PyJWT bearer tokens (localStorage on frontend)
- React frontend with editorial design: Cormorant Garamond + Manrope, terracotta/indigo/jade palette
- Sticky glass navbar, cinematic hero, tetris-grid packages, editorial gallery, dark testimonial section, blog strip, contact form with sonner toasts, indigo footer
- Admin: dark indigo sidebar, filterable inquiry table, detail pane with status controls & delete
- test_credentials.md written

## Prioritized Backlog (P1)
- Individual package detail pages with itinerary breakdown
- Newsletter subscription capture
- Email notifications to admin on new inquiry (Resend/SendGrid)
- Ratings shown on testimonials & 5-star iconography
- WhatsApp click-to-chat float

## P2
- Blog article detail pages
- Multi-language (Odia/Hindi/English)
- Photo lightbox on gallery
