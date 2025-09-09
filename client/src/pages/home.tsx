import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import ShopSection from "@/components/shop-section";
import SchoolSection from "@/components/school-section";
import WhyChooseUs from "@/components/why-choose-us";
import Testimonials from "@/components/testimonials";
import Gallery from "@/components/gallery";
import BlogSection from "@/components/blog-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";
import FloatingWhatsapp from "@/components/floating-whatsapp";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <ShopSection />
      <SchoolSection />
      <WhyChooseUs />
      <Testimonials />
      <Gallery />
      <BlogSection />
      <ContactSection />
      <Footer />
      <FloatingWhatsapp />
    </div>
  );
}
