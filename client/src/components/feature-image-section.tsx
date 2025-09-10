import { useEffect, useState } from 'react';

export default function FeatureImageSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('feature-image-section');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="feature-image-section" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Experience Floral Excellence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the art of professional floristry through our carefully crafted arrangements and expert training programs
          </p>
        </div>

        {/* Large Feature Image with Animation */}
        <div className="relative overflow-hidden rounded-3xl shadow-2xl">
          <div 
            className={`transform transition-all duration-1000 ease-out ${
              isVisible 
                ? 'translate-y-0 opacity-100 scale-100' 
                : 'translate-y-8 opacity-0 scale-105'
            }`}
          >
            <img
              src="https://images.unsplash.com/photo-1487070183336-b863922373d4?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Beautiful floral arrangement workshop"
              className="w-full h-96 md:h-[600px] object-cover"
              data-testid="feature-image-main"
            />
            
            {/* Overlay with animated content */}
            <div className="absolute inset-0 bg-black bg-opacity-20">
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <div 
                  className={`bg-white bg-opacity-95 backdrop-blur-sm rounded-xl p-6 md:p-8 transform transition-all duration-1000 delay-300 ${
                    isVisible 
                      ? 'translate-y-0 opacity-100' 
                      : 'translate-y-4 opacity-0'
                  }`}
                >
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Professional Floral Design Training
                  </h3>
                  <p className="text-lg text-gray-700 mb-6">
                    Join our certified courses and learn from industry experts in our state-of-the-art facility
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                      data-testid="button-explore-courses"
                    >
                      Explore Courses
                    </button>
                    <button 
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                      data-testid="button-shop-flowers"
                    >
                      Shop Fresh Flowers
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional animated elements */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {[
            {
              image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              title: "Fresh Daily Deliveries",
              description: "Premium flowers sourced fresh every morning"
            },
            {
              image: "https://images.unsplash.com/photo-1606220838315-056192d5e927?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              title: "Expert Craftsmanship",
              description: "Professionally designed arrangements for every occasion"
            },
            {
              image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              title: "Certified Training",
              description: "Learn from industry professionals with hands-on experience"
            }
          ].map((item, index) => (
            <div 
              key={index}
              className={`transform transition-all duration-700 delay-${(index + 1) * 200} ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-6 opacity-0'
              }`}
            >
              <div className="group cursor-pointer">
                <div className="overflow-hidden rounded-xl mb-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    data-testid={`feature-image-${index + 1}`}
                  />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}