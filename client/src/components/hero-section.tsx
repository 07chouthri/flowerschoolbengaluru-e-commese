import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, GraduationCap, Star } from "lucide-react";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="hero-gradient section-padding mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 slide-in-left">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="text-foreground fade-in">Buy Fresh Flowers &</span>
              <br />
              <span className="gradient-text fade-in-delay-1">Learn Floral Art</span>
              <br />
              <span className="text-foreground fade-in-delay-2">with Us</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-md fade-in-delay-1">
              India's premier floral design institute & online flower marketplace. Create beautiful arrangements while mastering the art of floral design.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 fade-in-delay-2">
              <Button 
                size="lg"
                onClick={() => scrollToSection('shop')}
                className="text-lg font-semibold shadow-lg hover:shadow-xl button-glow"
                data-testid="button-hero-shop"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Shop Now
              </Button>
              <Button 
                size="lg"
                variant="secondary"
                onClick={() => scrollToSection('school')}
                className="text-lg font-semibold shadow-lg hover:shadow-xl button-glow"
                data-testid="button-hero-classes"
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                Join Classes
              </Button>
            </div>
          </div>
          <div className="relative slide-in-right">
            <img 
              src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
              alt="Students learning floral design with fresh flower arrangements" 
              className="rounded-2xl shadow-2xl image-hover w-full object-cover flower-float"
            />
            
            {/* Floating testimonial badge */}
            <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-xl card-shadow fade-in-delay-3 card-hover-lift">
              <div className="flex items-center space-x-3">
                <div className="flex text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-sm text-muted-foreground font-semibold">500+ Happy Students</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
