const GALLERY = [
  { url: "https://images.pexels.com/photos/38128176/pexels-photo-38128176.jpeg", alt: "Puri Beach Sunset", label: "Puri" },
  { url: "https://images.pexels.com/photos/15678073/pexels-photo-15678073.jpeg", alt: "Odissi Dance", label: "Odissi" },
  { url: "https://images.pexels.com/photos/10317127/pexels-photo-10317127.jpeg", alt: "Traditional Textiles", label: "Ikat & Sambalpuri" },
  { url: "https://images.unsplash.com/flagged/photo-1577604981316-298e453a19dd", alt: "Tribal heritage", label: "Koraput Hills" },
  { url: "https://images.pexels.com/photos/20371128/pexels-photo-20371128.jpeg", alt: "Konark wheel", label: "Konark" },
  { url: "https://images.unsplash.com/photo-1618843808465-befb4ad4a183", alt: "Chilika Lake", label: "Chilika" },
];

export default function Gallery() {
  return (
    <section id="gallery" className="relative py-24 lg:py-32" data-testid="gallery-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-8">
            <div className="overline text-terracotta">Destinations</div>
            <h2 className="mt-3 font-serif text-4xl sm:text-5xl text-ink tracking-tight leading-[1.05]">
              A land woven in <em className="not-italic text-jade">indigo</em>,<br /> sand and stone.
            </h2>
          </div>
          <p className="lg:col-span-4 text-ink-soft">
            From Bay of Bengal shores to the granite Eastern Ghats — six frames of a state that
            asks to be read slowly.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 lg:grid-cols-12 gap-4">
          {GALLERY.map((g, i) => {
            const span = [
              "lg:col-span-6 lg:row-span-2 aspect-[4/5]",
              "lg:col-span-3 aspect-square",
              "lg:col-span-3 aspect-square",
              "lg:col-span-4 aspect-[4/3]",
              "lg:col-span-4 aspect-[4/3]",
              "lg:col-span-4 aspect-[4/3]",
            ][i];
            return (
              <div key={i} data-testid={`gallery-item-${i}`} className={`relative group overflow-hidden border border-warm card-hover ${span}`}>
                <img src={g.url} alt={g.alt} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />
                <div className="absolute bottom-4 left-5 text-cream">
                  <div className="overline text-cream/75">Odisha</div>
                  <div className="font-serif text-2xl">{g.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
