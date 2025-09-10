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
    <section id="home" className="bg-gradient-to-br from-white via-pink-50/30 to-gray-50/30 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[600px]">
          <div className="space-y-8">
            {/* Professional badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              India's Premier Floral Institute
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold leading-[1.1] text-gray-900">
              Fresh Flowers &<br />
              <span className="text-primary">Professional</span><br />
              Floral Education
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
              Transform your passion for flowers into expertise. Shop premium flowers and master the art of floral design with India's leading institute in Bengaluru.
            </p>
            
            {/* Professional stats */}
            <div className="grid grid-cols-3 gap-8 py-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-gray-600">Students Trained</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">15+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                onClick={() => scrollToSection('shop')}
                className="text-lg font-semibold bg-primary hover:bg-primary/90"
                data-testid="button-hero-shop"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Shop Flowers
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('school')}
                className="text-lg font-semibold border-2 border-secondary text-secondary hover:bg-secondary hover:text-white"
                data-testid="button-hero-classes"
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                Explore Courses
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-8">
              <img 
                src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                alt="Professional floral design students learning flower arrangement" 
                className="rounded-2xl shadow-xl w-full object-cover h-[500px]"
              />
              
              {/* Professional certification badge */}
              <div className="absolute -bottom-4 -right-4 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-primary fill-current" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Certified Institute</div>
                    <div className="text-sm text-gray-600">Government Recognized</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
