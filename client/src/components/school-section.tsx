import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  UserCheck, HandHeart, Award, Briefcase, Sprout, Crown, Leaf, 
  Check, Download, ArrowRight, Play, Star, Users, Clock, AwardIcon, 
  Sparkles, Heart, Target, Recycle, Gift, IndianRupee, Calendar,
  BookOpen, GraduationCap, Sparkle, Zap, Flower
} from "lucide-react";

// Import your images
import CenterFlower from "../images/CenterFlower.jpg";
import RightImage1 from "../images/rightimage1.jpg";
import RightImage2 from "../images/rightimage2.jpg";
import LeftImage1 from "../images/leftimage1.jpg";
import LeftImage2 from "../images/leftimage2.jpg";

import SchoolFlowerCenter2 from "../images/SchoolFlowerCenter2.jpg";
import SchoolRight1 from "../images/SchoolRight1.jpg";
import SchoolRight2 from "../images/SchoolRight2.jpg";
import SchoolLeft1 from "../images/SchoolLeft1.jpg";
import SchoolLeft2 from "../images/SchoolLeft2.jpg";

// Gallery Component (using your images)
function Gallery() {
  const [activeTab, setActiveTab] = useState<'shop' | 'school'>('school'); // Default to 'school'

  const shopImages = {
    center: {
      src: CenterFlower,
      alt: "Beautiful flower arrangements",
    },
    right: [
      {
        src: RightImage1,
        alt: "Floral bouquet",
      },
      {
        src: RightImage2,
        alt: "Wedding flowers",
      }
    ],
    left: [
      {
        src: LeftImage1,
        alt: "Seasonal arrangements",
      },
      {
        src: LeftImage2,
        alt: "Custom floral designs",
      }
    ]
  };

  const schoolImages = {
    center: {
      src: SchoolFlowerCenter2,
      alt: "Floral design workshop in progress",
    },
    right: [
      {
        src:  SchoolRight1,
        alt: "Professional instructor teaching",
      },
      {
        src: SchoolRight2,
        alt: "Student practicing floral design",
      }
    ],
    left: [
      {
        src: SchoolLeft1,
        alt: "Hands-on learning experience",
      },
      {
        src: SchoolLeft2,
        alt: "Floral design certification",
      }
    ]
  };

  const currentImages = activeTab === 'shop' ? shopImages : schoolImages;

  return (
    <section id="gallery" className="bg-white pt-16 pb-10">
      <div className="text-center mb-16">
      
                             <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900 tracking-tight">
  Our {" "}
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
    Gallery
  </span>{" "}

</h2>
        <p className="text-xl text-muted-foreground">Explore our beautiful creations and learning moments</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-12">
        <div className="bg-muted rounded-full p-1">
          <Button
            variant={activeTab === 'shop' ? "default" : "ghost"}
            onClick={() => setActiveTab('shop')}
            className="rounded-full px-6 py-3"
          >
            Flower Shop
          </Button>
          <Button
            variant={activeTab === 'school' ? "default" : "ghost"}
            onClick={() => setActiveTab('school')}
            className="rounded-full px-6 py-3"
          >
            Flower School
          </Button>
        </div>
      </div>

      {/* Gallery Layout */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-6">
        {/* Left Side Images - Vertical Stack */}
        <div className="lg:w-1/4 space-y-6">
          {currentImages.left.map((image, index) => (
            <div 
              key={`left-${index}`}
              className="group cursor-pointer relative overflow-hidden rounded-xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
            >
              <div className="relative overflow-hidden rounded-xl">
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-semibold text-sm mb-1">{image.alt}</h3>
                </div>
                <div className="absolute inset-0 rounded-xl ring-1 ring-white/20 group-hover:ring-pink-300/50 transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Center Image - Larger */}
        <div className="lg:w-2/4 group cursor-pointer relative overflow-hidden rounded-xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
          <div className="relative overflow-hidden rounded-xl">
            <img 
              src={currentImages.center.src} 
              alt={currentImages.center.alt} 
              className="w-full h-[550px] object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="font-semibold text-lg mb-2">{currentImages.center.alt}</h3>
            </div>
            <div className="absolute inset-0 rounded-xl ring-1 ring-white/20 group-hover:ring-pink-300/50 transition-all duration-500"></div>
          </div>
        </div>

        {/* Right Side Images - Vertical Stack */}
        <div className="lg:w-1/4 space-y-6">
          {currentImages.right.map((image, index) => (
            <div 
              key={`right-${index}`}
              className="group cursor-pointer relative overflow-hidden rounded-xl bg-white/60 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2"
            >
              <div className="relative overflow-hidden rounded-xl">
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="font-semibold text-sm mb-1">{image.alt}</h3>
                </div>
                <div className="absolute inset-0 rounded-xl ring-1 ring-white/20 group-hover:ring-pink-300/50 transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SchoolSection() {
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

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const courses = [
    {
      id: 1,
      title: "Beginner's Course to Floristry",
      duration: "5 Days",
      price: "75,000",
      description: "Foundational course introducing modern & traditional floral arrangements",
      features: [
        "Hard-stemmed flower design",
        "Soft-stemmed bloom handling",
        "Garden-style centerpiece creation",
        "Hand-tied bouquets crafting",
        "4 beginner-level foam arrangements"
      ],
      popular: false,
      icon: Sprout
    },
    {
      id: 2,
      title: "Intermediate Course to Floristry",
      duration: "5 Days",
      price: "75,000",
      description: "Build on foundational skills with intermediate techniques",
      features: [
        "Local market flower sourcing",
        "Monochromatic arrangements",
        "Hand-tied wedding bouquets",
        "Event styling basics & tablescaping",
        "3 foam arrangements + gift hamper"
      ],
      popular: true,
      icon: Flower,
    },
    {
      id: 3,
      title: "Advanced Course to Floristry",
      duration: "5 Days",
      price: "75,000",
      description: "Elevate technical and creative skills with advanced concepts",
      features: [
        "Color theory & pricing strategies",
        "Recipe management for business",
        "Classic compote arrangement",
        "Advanced foam arrangements",
        "Framing techniques"
      ],
      popular: false,
      icon: Crown
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Passion for Teaching",
      description: "We teach floral design with deep respect for nature and community"
    },
    {
      icon: Target,
      title: "Empowerment Focus",
      description: "Nurturing technical excellence and creative vision"
    },
    {
      icon: Recycle,
      title: "Sustainable Practices",
      description: "Responsible sourcing, minimal waste, eco-friendly methods"
    },
    {
      icon: Sparkle,
      title: "Celebration of Beauty",
      description: "Creating designs that inspire, connect, and celebrate life"
    }
  ];

  return (
    <section 
      id="school" 
      ref={sectionRef}
      className="py-16 md:py-28 bg-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Mission Statement */}
        <div className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
                     <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight text-gray-900 tracking-tight">
  Flower {" "}
  <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600">
    School
  </span>{" "}

</h2>
          <div className="inline-flex items-center justify-center px-6 py-3 rounded-full font-medium mb-8"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            "Teaching floral design with due respect for nature & community"
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
            <p>
              We empower aspiring and experienced florists alike through hands-on training, artistic exploration, 
              and deep respect for nature's beauty. Our commitment is to nurture not only technical excellence but 
              also the confidence and vision to create floral designs that inspire, connect, and celebrate life's 
              most meaningful moments.
            </p>
            <p>
              We source responsibly, minimise wastage, embrace sustainable practices, so every bouquet not only 
              celebrates life's beauty, but helps preserve it for generations to come.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className={`mb-20 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-12">
            Our Core Values at the School
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card 
                  key={index}
                  className="text-center border-0 bg-gray-50 hover:bg-gray-100 transition-all duration-500 hover:-translate-y-1"
                >
                  <CardContent className="p-6">
                    <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-pink-600" />
                    </div>
                    <h4 className="font-semibold text-lg text-gray-900 mb-2">{value.title}</h4>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Gallery Component */}
        <div className={`mb-20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Gallery />
        </div>

        {/* Main Courses */}
        <div className={`mb-20 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Floristry Courses</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive 5-day programs designed to transform your passion into profession
            </p>
            <div className="mt-4 bg-amber-100 text-amber-800 px-4 py-2 rounded-lg inline-flex items-center">
              <IndianRupee className="w-4 h-4 mr-1" />
              <span className="font-semibold">Special Offer:</span> Get 5% discount when you enroll in all 3 courses!
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {courses.map((course, index) => {
              const IconComponent = course.icon;
              return (
                <Card 
                  key={course.id} 
                  className={`overflow-hidden transition-all duration-500 hover:shadow-xl ${
                    course.popular ? 'border-2 border-pink-300 relative' : 'border-gray-200'
                  }`}
                >
                  
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <div className={`inline-flex items-center justify-center p-4 rounded-full mb-4 ${
                        course.popular ? 'bg-pink-100' : 'bg-gray-100'
                      }`}>
                        <IconComponent className={`w-8 h-8 ${
                          course.popular ? 'text-pink-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {course.title}
                      </h3>
                      <div className="flex items-center justify-center gap-4 mb-3">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {course.duration}
                        </div>
                        <div className="flex items-center text-lg font-bold text-pink-600">
                          <IndianRupee className="w-4 h-4" />
                          {course.price}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">
                        {course.description}
                      </p>
                    </div>
                    
                    <ul className="space-y-3 text-sm text-gray-600 mb-6">
                      {course.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <Check className="w-4 h-4 text-pink-500 mt-0.5 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className="w-full transition-transform duration-300 hover:scale-105" 
                      size="lg"
                      variant={course.popular ? "default" : "outline"}
                   
                    >
                      Enroll Now <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}