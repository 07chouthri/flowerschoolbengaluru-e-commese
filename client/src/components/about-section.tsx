import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FlowerCraft from "../images/FlowerCraft.jpg";
import { 
  Flower, Users, GraduationCap, Award, Sparkles, 
  Heart, Target, Globe, Clock, Star, ChevronRight,
  Palette, Brush, Sparkle, Leaf, Gem, Crown
} from "lucide-react";

export default function AboutSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.disconnect();
    };
  }, []);

  const features = [
    {
      icon: Palette,
      title: "Creative Expression",
      description: "Unleash your artistic potential through floral design"
    },
    {
      icon: Brush,
      title: "Hands-on Learning",
      description: "Practical training with premium flowers and materials"
    },
    {
      icon: Sparkle,
      title: "Expert Guidance",
      description: "Learn from internationally certified floral artists"
    },
    {
      icon: Leaf,
      title: "Sustainable Practices",
      description: "Eco-friendly floral design techniques and materials"
    }
  ];

  const achievements = [
    { number: "500+", label: "Students Transformed", icon: Users },
    { number: "15+", label: "Years Excellence", icon: Award },
    { number: "98%", label: "Success Stories", icon: Star },
    { number: "1000+", label: "Arrangements Created", icon: Flower }
  ];

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="py-16 md:py-28 bg-white relative overflow-hidden"
    >
    

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header with creative layout */}
        <div className="text-center mb-20">
      
           <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900 tracking-tight">
  About {" "}
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
    Our
  </span>{" "}
  Journey
</h2>
           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            At Flower School Bangalore, we transform passion into profession through immersive floral education that celebrates creativity, technique, and the pure joy of flowers.
          </p>
        </div>

        {/* Creative grid layout */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 font-extrabold leading-tight text-gray-900 tracking-tight">
                Craft Your Floral Masterpiece
              </h3>
              
              <p className="text-lg text-gray-600 leading-relaxed">
                Whether you're beginning your journey or refining your skills, our programs are designed to nurture your unique creative voice while providing professional-grade training.
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index}
                    className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-500 hover:-translate-y-1 group ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                    style={{ transitionDelay: `${500 + index * 100}ms` }}
                  >
                    <div className="bg-gradient-to-br from-gray-100 to-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-pink-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Visual element with image */}
          <div className={`relative transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-x-8'}`}>
            <div className="p-4  flex items-center justify-center overflow-hidden group">
              <div className="relative w-full h-full rounded-2xl overflow-hidden">
            
<img 
  src={FlowerCraft}
  alt="Floral Craftsmanship at Flower School Bangalore"
  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
/>
                
           
                {/* Content overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <h4 className="font-semibold text-lg mb-1">Floral Artistry</h4>
                  <p className="text-sm opacity-90">Handcrafted with passion</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission statement */}
        <div className="text-center p-10 md:p-1  duration-1000 delay-900">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
              Our Mission: Cultivating Creative Excellence
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed">
              We're committed to providing world-class floral education that combines technical mastery with artistic expression. Our goal is to empower every student to create breathtaking floral arrangements that tell stories and evoke emotions.
            </p>
           
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(2deg);
          }
          66% {
            transform: translateY(5px) rotate(-1deg);
          }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}