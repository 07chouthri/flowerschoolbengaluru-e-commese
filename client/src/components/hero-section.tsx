import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, GraduationCap, Star, Sparkles } from "lucide-react";
import { CreativeButton, SectionDivider } from "@/components/creative-enhancements";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="bg-gradient-to-br from-orange-50 via-purple-50 to-teal-50 pt-24 pb-16">
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
              <CreativeButton 
                onClick={() => scrollToSection('shop')}
                variant="primary"
                className="text-lg font-semibold"
                data-testid="button-hero-shop"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Shop Flowers
                <Sparkles className="w-4 h-4 ml-2" />
              </CreativeButton>
              <CreativeButton 
                onClick={() => scrollToSection('school')}
                variant="secondary"
                className="text-lg font-semibold"
                data-testid="button-hero-classes"
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                Explore Courses
              </CreativeButton>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative bg-gradient-to-br from-orange-100/70 via-purple-100/60 to-teal-100/70 rounded-3xl p-8 backdrop-blur-sm border border-orange-200/50 shadow-xl">
              <div className="relative overflow-hidden rounded-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                  alt="Professional floral design students learning flower arrangement" 
                  className="w-full object-cover h-[500px] hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Professional certification badge with enhanced design */}
              <div className="absolute -bottom-4 -right-4 bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-pink-100 hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-pink-600 fill-current animate-pulse" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Certified Institute</div>
                    <div className="text-sm text-gray-600">Government Recognized</div>
                  </div>
                </div>
              </div>

              {/* Floating elements around the image */}
              <div className="absolute top-4 left-4 w-8 h-8 bg-pink-400/30 rounded-full blur-sm animate-bounce delay-300"></div>
              <div className="absolute top-1/3 left-2 w-6 h-6 bg-purple-400/30 rounded-full blur-sm animate-pulse delay-1000"></div>
              <div className="absolute bottom-1/4 right-2 w-10 h-10 bg-blue-400/20 rounded-full blur-sm animate-bounce delay-700"></div>
            </div>
          </div>
        </div>
      </div>
      <SectionDivider variant="wave" />
    </section>
  );
}
