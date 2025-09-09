import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Gallery() {
  const [activeTab, setActiveTab] = useState<'shop' | 'school'>('shop');

  const shopImages = [
    {
      src: "https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      alt: "Elegant wedding bouquet arrangement",
    },
    {
      src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      alt: "Vibrant spring flower bouquet",
    },
    {
      src: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      alt: "Premium red roses arrangement",
    },
    {
      src: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      alt: "White orchid elegance",
    },
  ];

  const schoolImages = [
    {
      src: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      alt: "Students in floral design workshop",
    },
    {
      src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      alt: "Professional creating floral arrangement",
    },
    {
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      alt: "Student working on bouquet design",
    },
    {
      src: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400",
      alt: "Hands-on floral arrangement class",
    },
  ];

  const currentImages = activeTab === 'shop' ? shopImages : schoolImages;

  return (
    <section id="gallery" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Gallery</h2>
          <p className="text-xl text-muted-foreground">Explore our beautiful creations and learning moments</p>
        </div>

        <div className="mb-8 text-center">
          <Button
            variant={activeTab === 'shop' ? 'default' : 'secondary'}
            className="rounded-full mr-4"
            onClick={() => setActiveTab('shop')}
            data-testid="button-gallery-shop"
          >
            Shop Gallery
          </Button>
          <Button
            variant={activeTab === 'school' ? 'default' : 'secondary'}
            className="rounded-full"
            onClick={() => setActiveTab('school')}
            data-testid="button-gallery-school"
          >
            School Gallery
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentImages.map((image, index) => (
            <div 
              key={`${activeTab}-${index}`} 
              className="group cursor-pointer"
              data-testid={`gallery-item-${index}`}
            >
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-64 object-cover rounded-xl image-hover" 
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button 
            variant="secondary" 
            size="lg"
            data-testid="button-view-more"
          >
            View More Gallery
          </Button>
        </div>
      </div>
    </section>
  );
}
