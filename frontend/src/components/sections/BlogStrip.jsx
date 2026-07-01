import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";
import { ArrowUpRight } from "lucide-react";

export default function BlogStrip() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get("/blog").then((r) => setItems(r.data)).catch(() => setItems([]));
  }, []);

  const formatDate = (s) => {
    try {
      return new Date(s).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    } catch { return s; }
  };

  return (
    <section id="stories" className="relative py-24 lg:py-32" data-testid="stories-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 items-end gap-6">
          <div className="lg:col-span-8">
            <div className="overline text-terracotta">Field notes</div>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl text-ink tracking-tight leading-[1.05]">
              Stories from the <em className="not-italic text-jade">road</em>.
            </h2>
          </div>
          <p className="lg:col-span-4 text-ink-soft">
            Slow reads from our guides — dispatches from tribal haats, temple courtyards and
            monsoon-drenched forests.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-8">
          {items.map((post) => (
            <article key={post.id} data-testid={`blog-card-${post.slug}`} className="group cursor-pointer">
              <div className="overflow-hidden aspect-[4/3] border border-warm card-hover">
                <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <div className="mt-5">
                <div className="overline text-ink-soft flex items-center gap-3">
                  <span>{formatDate(post.published_at)}</span>
                  <span>·</span>
                  <span>{post.author}</span>
                </div>
                <h3 className="mt-3 font-serif text-2xl lg:text-3xl text-ink leading-tight group-hover:text-terracotta transition-colors duration-500">
                  {post.title}
                </h3>
                <p className="mt-3 text-sm text-ink-soft leading-relaxed">{post.excerpt}</p>
                <div className="mt-4 inline-flex items-center gap-2 text-sm text-ink group-hover:text-terracotta transition-colors">
                  Read the note <ArrowUpRight size={14} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
