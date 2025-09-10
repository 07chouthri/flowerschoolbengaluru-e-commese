import { Button } from "@/components/ui/button";
import { ShoppingBag, GraduationCap, Flower, Users, Award, Calendar } from "lucide-react";
import flowerSchoolLogo from "@assets/Flower_School_Logo_1757484169081.png";

export default function HeroSection() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Online Flower Shop Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-200 flex flex-col justify-between">
            {/* Bouquet Bar Logo */}
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-gray-800 mb-2">
                <span className="text-pink-600">B</span>
                <span className="text-purple-600 text-2xl">B</span>
              </div>
              <div className="text-lg font-semibold text-gray-700 tracking-wide">
                BOUQUET BAR
              </div>
              <div className="text-sm text-gray-500 font-medium tracking-widest">
                BENGALURU
              </div>
            </div>
            
            <div className="text-center flex-grow">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Online Flower Shop
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Browse our exclusive collection of fresh flowers, bouquets, and arrangements
              </p>
              
              <Button 
                size="lg"
                onClick={() => scrollToSection('shop')}
                className="w-full text-lg py-4 h-auto font-semibold mb-8"
                data-testid="button-visit-shop"
              >
                Visit Shop Now
              </Button>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Flower className="w-5 h-5 text-pink-500" />
                <span className="text-sm font-medium">500+ Varieties</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-5 h-5 text-pink-500" />
                <span className="text-sm font-medium">Same Day Delivery</span>
              </div>
            </div>
          </div>
          
          {/* Floral Design School Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-pink-200 flex flex-col justify-between">
            {/* The Flower School Logo */}
            <div className="text-center mb-6">
              <img 
                src={flowerSchoolLogo}
                alt="The Flower School Bengaluru Logo"
                className="w-24 h-24 mx-auto mb-2"
              />
            </div>
            
            <div className="text-center flex-grow">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Floral Design School
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Learn professional floral design from expert instructors
              </p>
              
              <Button 
                size="lg"
                onClick={() => scrollToSection('school')}
                className="w-full text-lg py-4 h-auto font-semibold mb-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                data-testid="button-explore-courses"
              >
                Explore Courses
              </Button>
            </div>
            
            {/* Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Award className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium">Certified Courses</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium">Expert Instructors</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
