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
    <section id="home" className="bg-gradient-to-br from-white to-teal-50/50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center min-h-[600px]">
          <div className="space-y-8">
            {/* Professional badge */}
            <div className="text-sm font-medium text-gray-600 tracking-wider uppercase">
              PLAY. EXPLORE. LEARN.
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold leading-[1.2] text-gray-900">
              Welcome to<br />
              <span className="text-primary">Bouquet Bar: Your Gateway to Floral Artistry in Bengaluru</span>
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              At Bouquet Bar, we're dedicated to nurturing the next generation of floral artisans right here in Bengaluru. Our institute offers comprehensive courses and workshops designed to inspire creativity, foster talent, and unlock the secrets of floral design amidst the vibrant culture of Karnataka.
            </p>
            
          </div>
          
          <div className="relative">
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                    alt="Professional floral design workshop with flowers and tools" 
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300" 
                    alt="Beautiful flower arrangements in vases" 
                    className="w-full h-48 object-cover rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <LogoSectionDivider variant="floral" />
    </section>
  );
}
