import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Heart, Star, Download, Share2 } from "lucide-react";

export default function Gallery() {
  const galleryImages = [
    {
      id: 1,
      title: "Elegant Rose Bouquet",
      category: "Wedding",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&crop=center",
      likes: 142,
      views: 892,
      description: "Beautiful red roses arranged for a romantic wedding ceremony"
    },
    {
      id: 2,
      title: "Spring Wildflower Mix",
      category: "Seasonal",
      image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500&h=600&fit=crop&crop=center",
      likes: 86,
      views: 543,
      description: "Vibrant wildflowers capturing the essence of spring"
    },
    {
      id: 3,
      title: "Luxury Peony Collection",
      category: "Premium",
      image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=500&h=600&fit=crop&crop=center",
      likes: 198,
      views: 1247,
      description: "Premium peonies in soft pink and white tones"
    },
    {
      id: 4,
      title: "Modern Tropical Arrangement",
      category: "Contemporary",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&crop=center",
      likes: 73,
      views: 421,
      description: "Bold tropical flowers with contemporary styling"
    },
    {
      id: 5,
      title: "Classic White Lilies",
      category: "Traditional",
      image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500&h=600&fit=crop&crop=center",
      likes: 124,
      views: 789,
      description: "Timeless white lilies for elegant occasions"
    },
    {
      id: 6,
      title: "Sunflower Sunshine",
      category: "Cheerful",
      image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=500&h=600&fit=crop&crop=center",
      likes: 156,
      views: 934,
      description: "Bright sunflowers bringing joy and warmth"
    }
  ];

  const categories = ["All", "Wedding", "Seasonal", "Premium", "Contemporary", "Traditional", "Cheerful"];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Floral Gallery
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover our stunning collection of handcrafted floral arrangements. Each creation tells a unique story of beauty, elegance, and artistry.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
                className="hover:scale-105 transition-transform"
                data-testid={`filter-${category.toLowerCase()}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((item, index) => (
              <Card 
                key={item.id} 
                className="group hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden animate-fadeIn"
                data-testid={`gallery-item-${item.id}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    data-testid={`img-${item.id}`}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex space-x-3">
                      <Button size="icon" variant="secondary" className="hover:scale-110 transition-transform">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="hover:scale-110 transition-transform">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="secondary" className="hover:scale-110 transition-transform">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Badge 
                    className="absolute top-3 right-3 bg-white/90 text-black hover:bg-white"
                    data-testid={`badge-category-${item.id}`}
                  >
                    {item.category}
                  </Badge>
                </div>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-semibold" data-testid={`title-${item.id}`}>
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm mb-4" data-testid={`description-${item.id}`}>
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Heart className="h-4 w-4" />
                        <span data-testid={`likes-${item.id}`}>{item.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span data-testid={`views-${item.id}`}>{item.views}</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Star className="h-4 w-4 text-yellow-500" />
                      <Star className="h-4 w-4 text-gray-300" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Love What You See?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your special moments with our custom floral arrangements. Let us create something beautiful just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="hover:scale-105 transition-transform" data-testid="button-order-now">
              Order Custom Arrangement
            </Button>
            <Button size="lg" variant="outline" className="hover:scale-105 transition-transform" data-testid="button-contact">
              Contact Us
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}