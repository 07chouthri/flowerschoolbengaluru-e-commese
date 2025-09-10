import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, GraduationCap, Star } from "lucide-react";

export default function FreshFlowersSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="bg-gradient-to-br from-pink-50 to-rose-100 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <Badge variant="secondary" className="inline-flex items-center gap-2 text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              India's Premier Floral Institute
            </Badge>
            
            <h1 className="text-6xl md:text-7xl font-extrabold leading-[0.95] text-gray-900 tracking-tight">
              Fresh Flowers<br />
              & Professional<br />
              <span className="text-primary">Floral Education</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl font-light">
              Transform your passion for flowers into expertise. Shop premium flowers and master the art of floral design with India's leading institute.
            </p>
            
            {/* Professional stats */}
            <div className="grid grid-cols-3 gap-8 py-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-gray-600">Students Trained</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">15+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1000+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 pt-4">
              <Button 
                size="lg"
                onClick={() => scrollToSection('shop')}
                className="text-lg px-8 py-4 h-auto font-semibold"
                data-testid="button-fresh-shop"
              >
                <ShoppingBag className="w-5 h-5 mr-3" />
                Shop Flowers
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => scrollToSection('school')}
                className="text-lg px-8 py-4 h-auto font-semibold border-2"
                data-testid="button-fresh-classes"
              >
                <GraduationCap className="w-5 h-5 mr-3" />
                Explore Courses
              </Button>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-200">
              <div className="relative overflow-hidden rounded-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
                  alt="Professional floral design students learning flower arrangement" 
                  className="w-full object-cover h-[500px] hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Professional certification badge with enhanced design */}
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-pink-500 to-rose-500 text-white p-6 rounded-xl shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white fill-current" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Certified Institute</div>
                    <div className="text-sm text-white/80">Government Recognized</div>
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
    </section>
  );
}