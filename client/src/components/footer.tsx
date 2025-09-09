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
    <footer className="footer-gradient text-white section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enhanced Brand Section */}
        <div className="text-center mb-12 fade-in">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <img 
              src={logoPath} 
              alt="Bouquet Bar Logo" 
              className="h-20 w-auto logo-pulse flower-float" 
            />
            <div>
              <h2 className="text-4xl font-bold gradient-text mb-2">Bouquet Bar</h2>
              <p className="text-lg text-pink-200">Bengaluru</p>
            </div>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            India's premier floral design institute & online flower marketplace. 
            Creating beautiful moments with fresh flowers and professional floral education.
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Social Media */}
          <div className="space-y-4 fade-in-delay-1">
            <h4 className="text-lg font-semibold text-pink-200">Connect With Us</h4>
            <div className="flex space-x-4 justify-center md:justify-start">
              <button 
                className="bg-pink-600/20 hover:bg-pink-500 p-3 rounded-full transition-all duration-300 hover:scale-110"
                data-testid="link-instagram"
              >
                <Instagram className="w-6 h-6" />
              </button>
              <button 
                className="bg-red-600/20 hover:bg-red-500 p-3 rounded-full transition-all duration-300 hover:scale-110"
                data-testid="link-youtube"
              >
                <Youtube className="w-6 h-6" />
              </button>
              <button 
                className="bg-green-600/20 hover:bg-green-500 p-3 rounded-full transition-all duration-300 hover:scale-110"
                data-testid="link-whatsapp"
              >
                <MessageCircle className="w-6 h-6" />
              </button>
              <button 
                className="bg-blue-600/20 hover:bg-blue-500 p-3 rounded-full transition-all duration-300 hover:scale-110"
                data-testid="link-facebook"
              >
                <Facebook className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 fade-in-delay-1">
            <h4 className="text-lg font-semibold text-pink-200">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button 
                  onClick={() => scrollToSection('home')} 
                  className="hover:text-pink-400 transition-all duration-300 hover:translate-x-2"
                  data-testid="footer-link-home"
                >
                  🏠 Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('shop')} 
                  className="hover:text-pink-400 transition-all duration-300 hover:translate-x-2"
                  data-testid="footer-link-shop"
                >
                  🌸 Shop
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('school')} 
                  className="hover:text-green-400 transition-all duration-300 hover:translate-x-2"
                  data-testid="footer-link-school"
                >
                  🎓 School
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about')} 
                  className="hover:text-pink-400 transition-all duration-300 hover:translate-x-2"
                  data-testid="footer-link-about"
                >
                  💝 About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('gallery')} 
                  className="hover:text-pink-400 transition-all duration-300 hover:translate-x-2"
                  data-testid="footer-link-gallery"
                >
                  📸 Gallery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('blog')} 
                  className="hover:text-green-400 transition-all duration-300 hover:translate-x-2"
                  data-testid="footer-link-blog"
                >
                  📰 Blog
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact')} 
                  className="hover:text-pink-400 transition-all duration-300 hover:translate-x-2"
                  data-testid="footer-link-contact"
                >
                  📞 Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Shop Categories */}
          <div className="space-y-4 fade-in-delay-2">
            <h4 className="text-lg font-semibold text-green-200">Shop Categories</h4>
            <ul className="space-y-2 text-gray-300">
              <li><button className="hover:text-pink-400 transition-all duration-300 hover:translate-x-2" data-testid="footer-category-roses">🌹 Fresh Roses</button></li>
              <li><button className="hover:text-pink-400 transition-all duration-300 hover:translate-x-2" data-testid="footer-category-orchids">🌺 Orchids</button></li>
              <li><button className="hover:text-pink-400 transition-all duration-300 hover:translate-x-2" data-testid="footer-category-wedding">👰 Wedding Flowers</button></li>
              <li><button className="hover:text-pink-400 transition-all duration-300 hover:translate-x-2" data-testid="footer-category-gifts">🎁 Gift Bouquets</button></li>
              <li><button className="hover:text-green-400 transition-all duration-300 hover:translate-x-2" data-testid="footer-category-seasonal">🌻 Seasonal Collections</button></li>
              <li><button className="hover:text-pink-400 transition-all duration-300 hover:translate-x-2" data-testid="footer-category-corporate">🏢 Corporate Orders</button></li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-4 fade-in-delay-3">
            <h4 className="text-lg font-semibold text-pink-200">Policies & Info</h4>
            <ul className="space-y-2 text-gray-300">
              <li><button className="hover:text-green-400 transition-all duration-300 hover:translate-x-2" data-testid="footer-policy-refund">💰 Refund Policy</button></li>
              <li><button className="hover:text-green-400 transition-all duration-300 hover:translate-x-2" data-testid="footer-policy-shipping">🚚 Shipping Info</button></li>
              <li><button className="hover:text-green-400 transition-all duration-300 hover:translate-x-2" data-testid="footer-policy-privacy">🔒 Privacy Policy</button></li>
              <li><button className="hover:text-green-400 transition-all duration-300 hover:translate-x-2" data-testid="footer-policy-terms">📋 Terms of Service</button></li>
              <li><button className="hover:text-pink-400 transition-all duration-300 hover:translate-x-2" data-testid="footer-policy-course">📚 Course Terms</button></li>
              <li><button className="hover:text-pink-400 transition-all duration-300 hover:translate-x-2" data-testid="footer-policy-career">💼 Career Opportunities</button></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-pink-800/30 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center fade-in-delay-2">
            <h4 className="text-2xl font-semibold mb-4 gradient-text">🌸 Stay Blooming!</h4>
            <p className="text-gray-300 mb-6">Subscribe to get updates on new flowers, courses, and special offers</p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-pink-900/20 border-pink-600/30 text-white placeholder:text-pink-300 focus:ring-pink-400 focus:border-pink-400"
                data-testid="input-newsletter-email"
              />
              <Button 
                type="submit"
                className="button-glow bg-gradient-to-r from-pink-600 to-green-600 hover:from-pink-500 hover:to-green-500"
                data-testid="button-newsletter-subscribe"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-pink-800/30 pt-8 text-center">
          <p className="text-gray-300 text-lg fade-in-delay-3">
            &copy; 2024 <span className="text-pink-400 font-semibold">Bouquet Bar Bengaluru</span>. All rights reserved. 
            <br className="md:hidden" />
            <span className="text-pink-300"> | Designed with 💝 for flower lovers</span>
          </p>
          <p className="text-green-300 mt-2">🌸 Spreading beauty, one flower at a time 🌸</p>
        </div>
      </div>
    </footer>
  );
}
