import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Instagram, Youtube, MessageCircle, Facebook } from "lucide-react";
import logoPath from "@assets/E_Commerce_Bouquet_Bar_Logo_1757433847861.png";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter subscription logic would go here
    console.log('Newsletter subscription submitted');
  };

  return (
    <footer className="bg-gradient-to-br from-pink-100 to-rose-100 text-gray-900 border-t border-pink-200">
      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Professional Brand Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-6 mb-8">
              <img 
                src={logoPath} 
                alt="Bouquet Bar Logo" 
                className="h-16 w-auto" 
              />
              <div className="text-left">
                <h2 className="text-3xl font-bold text-gray-900 tracking-wide">Bouquet Bar</h2>
                <p className="text-lg text-gray-600 font-medium">Bengaluru, India</p>
              </div>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-rose-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-light">
              India's premier floral design institute and online flower marketplace. 
              Transforming passion into expertise through professional floral education and premium flower collections.
            </p>
          </div>
          
          {/* Professional Separator */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent mb-12"></div>
          
          <div className="grid md:grid-cols-4 gap-10 mb-16">
            {/* Company Information */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-gray-900 border-b-2 border-primary pb-2 inline-block">Company</h4>
              <div className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed font-light">
                  Established as India's leading floral education institute, we combine traditional artistry with modern techniques.
                </p>
                <div className="flex space-x-4">
                  <button 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-lg transition-all duration-300 hover:scale-105 border border-gray-300"
                    data-testid="link-instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </button>
                  <button 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-lg transition-all duration-300 hover:scale-105 border border-gray-300"
                    data-testid="link-youtube"
                  >
                    <Youtube className="w-5 h-5" />
                  </button>
                  <button 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-lg transition-all duration-300 hover:scale-105 border border-gray-300"
                    data-testid="link-whatsapp"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 p-3 rounded-lg transition-all duration-300 hover:scale-105 border border-gray-300"
                    data-testid="link-facebook"
                  >
                    <Facebook className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed font-light mt-3">
                  Subscribe to receive updates on new courses, fresh arrivals, and exclusive offers.
                </p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-gray-900 border-b-2 border-primary pb-2 inline-block">Navigation</h4>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => scrollToSection('home')} 
                    className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium"
                    data-testid="footer-link-home"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('shop')} 
                    className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium"
                    data-testid="footer-link-shop"
                  >
                    Shop
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('school')} 
                    className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium"
                    data-testid="footer-link-school"
                  >
                    School
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('gallery')} 
                    className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium"
                    data-testid="footer-link-gallery"
                  >
                    Gallery
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('blog')} 
                    className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium"
                    data-testid="footer-link-blog"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('contact')} 
                    className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium"
                    data-testid="footer-link-contact"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-300 pb-2 inline-block">Services</h4>
              <ul className="space-y-3">
                <li><button className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium" data-testid="footer-category-roses">Fresh Flower Delivery</button></li>
                <li><button className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium" data-testid="footer-category-orchids">Premium Arrangements</button></li>
                <li><button className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium" data-testid="footer-category-wedding">Wedding Florals</button></li>
                <li><button className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium" data-testid="footer-category-gifts">Corporate Events</button></li>
                <li><button className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium" data-testid="footer-category-seasonal">Floral Design Courses</button></li>
                <li><button className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium" data-testid="footer-category-corporate">Certification Programs</button></li>
              </ul>
            </div>

            {/* Support */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-300 pb-2 inline-block">Support</h4>
              <ul className="space-y-3">
                <li><button className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium" data-testid="footer-policy-refund">Refund Policy</button></li>
                <li><button className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium" data-testid="footer-policy-shipping">Shipping Information</button></li>
                <li><button className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium" data-testid="footer-policy-privacy">Privacy Policy</button></li>
                <li><button className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium" data-testid="footer-policy-terms">Terms of Service</button></li>
                <li><button className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium" data-testid="footer-policy-course">Course Terms</button></li>
                <li><button className="text-gray-600 hover:text-gray-900 transition-all duration-300 font-medium" data-testid="footer-policy-career">Career Opportunities</button></li>
              </ul>
            </div>
          </div>


          {/* Professional Copyright Section */}
          <div className="mt-16">
            <div className="w-full h-px bg-gray-200 mb-8"></div>
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
              <div>
                <p className="text-gray-600 font-light">
                  &copy; 2024 <span className="text-gray-900 font-semibold">Bouquet Bar</span>. All rights reserved.
                </p>
                <p className="text-gray-500 text-sm mt-1 font-light">
                  Professional Floral Institute | Bengaluru, India
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <p className="text-gray-600 text-sm font-light">
                  Crafted with expertise for floral excellence
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}