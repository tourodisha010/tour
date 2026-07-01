import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Packages from "@/components/sections/Packages";
import Gallery from "@/components/sections/Gallery";
import Testimonials from "@/components/sections/Testimonials";
import BlogStrip from "@/components/sections/BlogStrip";
import ContactInquiry from "@/components/sections/ContactInquiry";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream" data-testid="landing-page">
      <Navbar />
      <Hero />
      <About />
      <Packages />
      <Gallery />
      <Testimonials />
      <BlogStrip />
      <ContactInquiry />
      <Footer />
    </div>
  );
}
