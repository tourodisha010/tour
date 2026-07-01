import { ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen w-full overflow-hidden" data-testid="hero-section">
      <img
        src="https://images.pexels.com/photos/32331079/pexels-photo-32331079.jpeg"
        alt="Konark Sun Temple Carvings"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 hero-mask" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-40 pb-20 min-h-screen flex flex-col justify-center">
        <div className="max-w-3xl">
          <div className="overline text-cream/85 fade-up" data-testid="hero-eyebrow" style={{textShadow: "0 2px 20px rgba(0,0,0,0.5)"}}>Odisha · Est. Bhubaneshwar</div>
          <h1 className="mt-5 font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.02] tracking-tight fade-up fade-up-delay-1" data-testid="hero-title" style={{textShadow: "0 4px 30px rgba(0,0,0,0.6)"}}>
            Where every stone
            <br />
            <em className="font-light not-italic text-cream/95">remembers a prayer.</em>
          </h1>
          <p className="mt-7 max-w-xl text-cream/95 text-lg leading-relaxed fade-up fade-up-delay-2" data-testid="hero-subtitle" style={{textShadow: "0 2px 20px rgba(0,0,0,0.6)"}}>
            We craft slow, rooted journeys across only one land — Odisha. Temples that hum at dawn,
            lagoons where dolphins graze, and forests where the tribal drum still keeps time.
          </p>
          <div className="mt-9 flex flex-wrap gap-4 fade-up fade-up-delay-3">
            <a href="#packages" className="btn-primary rounded-full px-7 py-3.5 text-sm" data-testid="hero-cta-explore">
              Explore Journeys
            </a>
            <a href="#contact" className="rounded-full px-7 py-3.5 text-sm border border-cream/70 text-cream hover:bg-cream hover:text-ink transition-all duration-500" data-testid="hero-cta-contact">
              Speak with a local
            </a>
          </div>
        </div>

        <div className="mt-16 flex items-center gap-2 text-cream/70 text-xs tracking-widest uppercase fade-up fade-up-delay-4">
          <ChevronDown size={16} className="animate-bounce" />
          <span>Scroll to discover</span>
        </div>
      </div>
    </section>
  );
}
