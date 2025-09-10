import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, GraduationCap, Star, Sparkles } from "lucide-react";
import { CreativeButton, LogoSectionDivider } from "@/components/creative-enhancements";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated background with logo colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-100/20 via-white to-teal-100/20"></div>
      
      {/* Floating logo-inspired shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-orange-600/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-gradient-to-br from-teal-400/15 to-teal-600/25 rounded-full blur-lg animate-bounce delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-gradient-to-br from-orange-300/8 to-orange-500/15 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-10 right-10 w-28 h-28 bg-gradient-to-br from-teal-300/12 to-teal-500/20 rounded-full blur-lg animate-bounce delay-700"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left space-y-8 scroll-reveal">
            <div className="space-y-6">
              <Badge className="text-orange-700 bg-orange-100 hover:bg-orange-200 magnetic-hover animate-logo-pulse">
                <Sparkles className="w-4 h-4 mr-2" />
                Welcome to Bouquet Bar
              </Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight animate-text-glow">
                Beautiful Flowers & 
                <span className="bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent"> 
                  Floral Education
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed">
                Discover fresh flowers for every occasion and master the art of floral design at Bengaluru's premier flower shop and school.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <CreativeButton 
                onClick={() => scrollToSection('shop')}
                size="lg"
                className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white px-10 py-5 text-lg font-semibold rounded-2xl shadow-lg magnetic-hover transform transition-all duration-300"
                data-testid="button-shop-now"
              >
                <ShoppingBag className="w-6 h-6 mr-3" />
                Shop Beautiful Flowers
              </CreativeButton>
              
              <CreativeButton 
                onClick={() => scrollToSection('school')}
                variant="outline"
                size="lg"
                className="border-2 border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white px-10 py-5 text-lg font-semibold rounded-2xl magnetic-hover transform transition-all duration-300"
                data-testid="button-explore-courses"
              >
                <GraduationCap className="w-6 h-6 mr-3" />
                Learn Floral Design
              </CreativeButton>
            </div>
            
            <div className="grid grid-cols-3 gap-8 justify-center lg:justify-start max-w-md mx-auto lg:mx-0">
              <div className="text-center magnetic-hover">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
                <span className="text-gray-800 font-bold text-lg">4.9</span>
                <p className="text-gray-600 text-sm">Customer Rating</p>
              </div>
              
              <div className="text-center magnetic-hover">
                <div className="flex items-center justify-center mb-2">
                  <Sparkles className="w-6 h-6 text-orange-500" />
                </div>
                <span className="text-gray-800 font-bold text-lg">500+</span>
                <p className="text-gray-600 text-sm">Happy Students</p>
              </div>
              
              <div className="text-center magnetic-hover">
                <div className="flex items-center justify-center mb-2">
                  <GraduationCap className="w-6 h-6 text-teal-500" />
                </div>
                <span className="text-gray-800 font-bold text-lg">15+</span>
                <p className="text-gray-600 text-sm">Years Experience</p>
              </div>
            </div>
          </div>
          
          {/* Right content */}
          <div className="relative scroll-reveal-right">
            <div className="relative group">
              {/* Decorative elements around image */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-lg magnetic-hover">
                  <img 
                    src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                    alt="Professional floral design workshop with flowers and tools" 
                    className="w-full h-48 object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg magnetic-hover">
                  <img 
                    src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                    alt="Beautiful flower arrangements in vases" 
                    className="w-full h-48 object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
              
              {/* Floating badges on image */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg animate-bounce delay-500">
                <p className="text-orange-600 font-semibold text-sm">Fresh Daily</p>
              </div>
              
              <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg animate-bounce delay-1000">
                <p className="text-teal-600 font-semibold text-sm">Expert Training</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LogoSectionDivider variant="floral" />
    </section>
  );
}
