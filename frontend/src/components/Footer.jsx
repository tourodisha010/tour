import { Mail, Phone, MapPin, Instagram, Facebook, MessageCircle } from "lucide-react";
import PatternDivider from "@/components/PatternDivider";

export default function Footer() {
  return (
    <footer className="bg-indigo-deep text-cream mt-24" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <PatternDivider light />
        <div className="mt-12 grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <span className="w-11 h-11 rounded-full bg-terracotta grid place-items-center text-cream font-serif text-2xl font-bold leading-none">T</span>
              <span className="font-serif text-4xl font-bold tracking-tight">Tour Odisha</span>
            </div>
            <p className="mt-5 max-w-md text-cream/70 leading-relaxed">
              An Odisha-only travel house crafting slow, rooted journeys through temples, tribal
              hills, mangroves and coastal towns — always led by locals who call this land home.
            </p>
          </div>

          <div>
            <div className="overline text-cream/60">Explore</div>
            <ul className="mt-4 space-y-2 text-cream/85">
              <li><a href="/#packages" className="hover:text-terracotta transition-colors">Packages</a></li>
              <li><a href="/#gallery" className="hover:text-terracotta transition-colors">Destinations</a></li>
              <li><a href="/#stories" className="hover:text-terracotta transition-colors">Stories</a></li>
              <li><a href="/#about" className="hover:text-terracotta transition-colors">About us</a></li>
            </ul>
          </div>

          <div>
            <div className="overline text-cream/60">Contact</div>
            <ul className="mt-4 space-y-3 text-cream/85">
              <li className="flex items-start gap-2"><MapPin size={16} className="mt-1"/> Bhubaneshwar, Odisha</li>
              <li className="flex items-start gap-2"><Phone size={16} className="mt-1"/> <a href="tel:7077006689" className="hover:text-terracotta">7077006689</a></li>
              <li className="flex items-start gap-2"><MessageCircle size={16} className="mt-1"/> <a href="https://wa.me/917077006689" target="_blank" rel="noreferrer" className="hover:text-terracotta">WhatsApp: 7077006689</a></li>
              <li className="flex items-start gap-2"><Mail size={16} className="mt-1"/> <a href="mailto:tourodisha010@gmail.com" className="hover:text-terracotta break-all">tourodisha010@gmail.com</a></li>
            </ul>
            <div className="mt-5 flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full border border-cream/25 grid place-items-center hover:bg-terracotta hover:border-terracotta transition-all" aria-label="Instagram"><Instagram size={16}/></a>
              <a href="#" className="w-9 h-9 rounded-full border border-cream/25 grid place-items-center hover:bg-terracotta hover:border-terracotta transition-all" aria-label="Facebook"><Facebook size={16}/></a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-cream/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="text-xs text-cream/55">© {new Date().getFullYear()} Tour Odisha. Crafted with reverence in Bhubaneshwar.</div>
          <a href="/admin/login" data-testid="footer-admin-link" className="text-xs text-cream/55 hover:text-terracotta transition-colors">Admin</a>
        </div>
      </div>
    </footer>
  );
}
