import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV = [
  { label: "Home", href: "/#home" },
  { label: "Packages", href: "/#packages" },
  { label: "Destinations", href: "/#gallery" },
  { label: "Stories", href: "/#stories" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? "glass-nav border-b border-warm" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <Link to="/" data-testid="brand-logo" className="flex items-center gap-3 group">
          <span className="w-10 h-10 rounded-full bg-terracotta grid place-items-center text-cream font-serif text-2xl font-bold leading-none">T</span>
          <span className="flex flex-col leading-none">
            <span className={`font-serif text-3xl font-bold tracking-tight ${scrolled ? "text-ink" : "text-white"} group-hover:text-terracotta transition-colors duration-500`} style={{textShadow: scrolled ? "none" : "0 2px 12px rgba(0,0,0,0.5)"}}>
              Tour Odisha
            </span>
            <span className={`overline mt-1 ${scrolled ? "text-ink-soft" : "text-cream/90"}`}>Journeys, rooted.</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-9">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              data-testid={`nav-link-${n.label.toLowerCase()}`}
              className={`text-sm tracking-wide hover:text-terracotta transition-colors duration-300 ${scrolled ? "text-ink" : "text-cream"}`}
            >
              {n.label}
            </a>
          ))}
          <a
            href="/#contact"
            data-testid="nav-cta-plan"
            className="btn-primary rounded-full px-5 py-2.5 text-sm"
          >
            Plan a Journey
          </a>
        </nav>

        <button
          type="button"
          data-testid="mobile-menu-toggle"
          onClick={() => setOpen((o) => !o)}
          className={`lg:hidden p-2 ${scrolled ? "text-ink" : "text-cream"}`}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden glass-nav border-t border-warm px-6 py-6" data-testid="mobile-menu">
          <div className="flex flex-col gap-4">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} className="text-ink text-lg" data-testid={`mobile-nav-${n.label.toLowerCase()}`}>
                {n.label}
              </a>
            ))}
            <a href="/#contact" className="btn-primary rounded-full px-5 py-3 text-sm w-fit" data-testid="mobile-nav-cta">
              Plan a Journey
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
