import { Card, CardContent } from "@/components/ui/card";
import { Flower, Presentation, Award } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-teal-50/30 to-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 right-10 w-20 h-20 bg-gradient-to-br from-teal-400/20 to-teal-600/30 rounded-full blur-lg animate-pulse delay-300"></div>
      <div className="absolute bottom-10 left-10 w-32 h-32 bg-gradient-to-br from-orange-400/15 to-orange-600/25 rounded-full blur-xl animate-pulse delay-700"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6 scroll-reveal-left">
            <div className="text-sm font-medium text-gray-600 tracking-wider uppercase">
              ABOUT US
            </div>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent leading-tight animate-text-glow">
              Bouquet Bar: Nurturing Creativity, Cultivating Talent
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Welcome to Bouquet Bar, your premier destination for floral education in Bengaluru, Karnataka. Established with a vision to inspire and empower budding florists, Bouquet Bar is committed to providing high-quality training and hands-on experience in the art of floral design.
            </p>
          </div>
          <div className="relative scroll-reveal-right">
            <div className="relative group">
              {/* Decorative elements around image */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
              
              <img 
                src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Beautiful floral arrangements and bouquets"
                className="w-full h-80 object-cover rounded-2xl shadow-xl transform group-hover:scale-105 transition-transform duration-500 relative z-10"
              />
              
              {/* Floating badge */}
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-lg animate-bounce delay-1000">
                <p className="text-teal-600 font-semibold text-sm">15+ Years Experience</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-20">
          <div className="text-center mb-12 scroll-reveal">
            <div className="text-sm font-medium text-gray-600 tracking-wider uppercase mb-4">
              WHY US
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent animate-text-glow">
              The best learning experience
            </h2>
            <div className="flex items-center justify-center gap-2 mt-4 text-gray-600">
              <span>✓ Holistic approach</span>
              <span className="mx-2">•</span>
              <span>✓ Passionate teachers</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-500 border-0 magnetic-hover group scroll-reveal" data-testid="card-expert-guidance">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-red-600 text-xl">❤️</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Expert Guidance</h3>
                <p className="text-gray-600 text-sm">Learn from experienced florists</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-500 border-0 magnetic-hover group scroll-reveal delay-100" data-testid="card-hands-on">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-orange-600 text-xl">🎨</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Hands-On Experience</h3>
                <p className="text-gray-600 text-sm">Gain practical skills with diverse flowers</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-500 border-0 magnetic-hover group scroll-reveal delay-200" data-testid="card-networking">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-teal-200 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-teal-600 text-xl">🔗</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Networking Opportunities</h3>
                <p className="text-gray-600 text-sm">Connect with industry professionals</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-500 border-0 magnetic-hover group scroll-reveal delay-300" data-testid="card-career">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-orange-600 text-xl">📈</span>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Career Advancement</h3>
                <p className="text-gray-600 text-sm">Prepare for success in floral design</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
