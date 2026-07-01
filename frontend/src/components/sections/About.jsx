import PatternDivider from "@/components/PatternDivider";

export default function About() {
  return (
    <section id="about" className="relative py-24 lg:py-32 paper-grain" data-testid="about-section">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <PatternDivider />
        <div className="mt-16 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <div className="overline text-terracotta">About us</div>
            <h2 className="mt-4 font-serif text-4xl sm:text-5xl text-ink leading-[1.05] tracking-tight">
              We serve <em className="text-terracotta not-italic">one</em> state,
              <br /> and we serve her <em className="not-italic">deeply</em>.
            </h2>
            <p className="mt-7 text-ink-soft leading-relaxed max-w-lg">
              Tour Odisha was built on a simple belief — that a place is best travelled by those
              who have wept, cooked, prayed and buried in it. Our team is entirely from Odisha —
              from Puri's beach-shack cooks to Koraput's Dongria weavers to Bhubaneshwar's temple
              historians. We don't sell destinations. We hand you the keys to a home.
            </p>
            <div className="mt-9 grid grid-cols-3 gap-6 max-w-md">
              <div>
                <div className="font-serif text-4xl text-terracotta">12+</div>
                <div className="overline text-ink-soft mt-1">Years, local</div>
              </div>
              <div>
                <div className="font-serif text-4xl text-terracotta">30</div>
                <div className="overline text-ink-soft mt-1">Districts covered</div>
              </div>
              <div>
                <div className="font-serif text-4xl text-terracotta">4.9★</div>
                <div className="overline text-ink-soft mt-1">Traveller rating</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] overflow-hidden border border-warm">
              <img
                src="https://images.pexels.com/photos/14090681/pexels-photo-14090681.jpeg"
                alt="Odissi dancer portrait"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:block absolute -bottom-8 -left-8 bg-cream border border-warm p-6 max-w-xs shadow-sm">
              <div className="font-serif text-2xl italic text-ink leading-tight">"Odissi taught me that stillness has a spine."</div>
              <div className="overline mt-4 text-ink-soft">— Rekha, resident dancer & guide</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
