import { useEffect, useState } from "react";
import { api } from "@/lib/apiClient";
import { Quote } from "lucide-react";

export default function Testimonials() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    api.get("/testimonials").then((r) => setItems(r.data)).catch(() => setItems([]));
  }, []);

  return (
    <section className="relative py-24 lg:py-32 bg-indigo-deep text-cream" data-testid="testimonials-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-2xl">
          <div className="overline text-terracotta">Traveller Notes</div>
          <h2 className="mt-3 font-serif text-4xl sm:text-5xl tracking-tight leading-[1.05]">
            Postcards from
            <br /> those who came home <em className="not-italic text-terracotta">changed</em>.
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-8">
          {items.map((t) => (
            <blockquote key={t.id} data-testid={`testimonial-${t.id}`} className="relative border-l border-cream/25 pl-6 lg:pl-8 py-2">
              <Quote className="absolute -left-4 top-0 text-terracotta" size={28} />
              <p className="font-serif italic text-2xl lg:text-3xl leading-snug text-cream/95">
                “{t.quote}”
              </p>
              <div className="mt-6 overline text-cream/60">
                — {t.name} · {t.location}
              </div>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
