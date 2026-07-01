import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";
import PatternDivider from "@/components/PatternDivider";
import { ArrowUpRight } from "lucide-react";

export default function Packages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/packages")
      .then((r) => setItems(r.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="packages" className="relative py-24 lg:py-32 bg-surface" data-testid="packages-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8">
            <div className="overline text-terracotta">Curated journeys</div>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl text-ink tracking-tight leading-[1.05]">
              Six ways to <em className="not-italic text-terracotta">meet</em> Odisha.
            </h2>
          </div>
          <div className="lg:col-span-4 text-ink-soft">
            Each journey is small-group, locally led and can be shaped to your pace, dietary needs and interests.
          </div>
        </div>

        <div className="mt-14">
          {loading ? (
            <div className="overline text-ink-soft">Loading journeys…</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
              {items.map((p, idx) => {
                const span = idx % 5 === 0 ? "lg:col-span-8" : idx % 5 === 1 ? "lg:col-span-4" : idx % 5 === 2 ? "lg:col-span-4" : idx % 5 === 3 ? "lg:col-span-4" : "lg:col-span-4";
                const tall = idx % 5 === 0;
                return (
                  <a
                    key={p.id}
                    href="#contact"
                    data-testid={`package-card-${p.slug}`}
                    className={`group relative card-hover overflow-hidden border border-warm bg-cream ${span}`}
                  >
                    <div className={`overflow-hidden ${tall ? "aspect-[16/11]" : "aspect-[4/3]"}`}>
                      <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-6 lg:p-7 flex flex-col gap-3">
                      <div className="flex items-center justify-between overline text-ink-soft">
                        <span>{p.subtitle}</span>
                        <span className="text-terracotta">{p.duration}</span>
                      </div>
                      <h3 className="font-serif text-2xl lg:text-3xl text-ink tracking-tight group-hover:text-terracotta transition-colors duration-500">
                        {p.title}
                      </h3>
                      <p className="text-sm text-ink-soft leading-relaxed line-clamp-2">{p.description}</p>
                      <div className="mt-3 flex items-center justify-between pt-4 border-t border-warm">
                        <span className="overline text-ink-soft">Enquire for details</span>
                        <span className="w-10 h-10 rounded-full border border-ink grid place-items-center text-ink group-hover:bg-terracotta group-hover:border-terracotta group-hover:text-cream transition-all duration-500">
                          <ArrowUpRight size={16} />
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-16">
          <PatternDivider />
        </div>
      </div>
    </section>
  );
}
