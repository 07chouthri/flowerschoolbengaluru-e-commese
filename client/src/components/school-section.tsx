import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCheck, HandHeart, Award, Briefcase, Sprout, Crown, Leaf, Check } from "lucide-react";
import type { Course } from "@shared/schema";

export default function SchoolSection() {
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
    queryFn: async () => {
      const response = await fetch('/api/courses');
      if (!response.ok) throw new Error('Failed to fetch courses');
      return response.json();
    }
  });

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const downloadBrochure = () => {
    // Simulate PDF download
    const link = document.createElement('a');
    link.href = '#';
    link.download = 'bouquet-bar-course-brochure.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getCourseIcon = (title: string) => {
    if (title.includes('Basics')) return Sprout;
    if (title.includes('Professional')) return Crown;
    if (title.includes('Garden')) return Leaf;
    return Sprout;
  };

  return (
    <section id="school" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Enroll Today CTA Section */}
        <div className="relative mb-20 rounded-3xl overflow-hidden">
          <div 
            className="relative h-96 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600)'
            }}
          >
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="relative h-full flex items-center justify-center text-center text-white">
              <div className="max-w-4xl mx-auto px-6">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Enroll Today and Let Your Creativity Blossom
                </h1>
                <p className="text-xl mb-8 max-w-2xl mx-auto">
                  Ready to embark on your floral journey? Explore our course offerings, meet our instructors, and take the first 
                  step towards realizing your dreams of becoming a skilled floral artisan. Whether you're looking to launch a 
                  business or simply explore your passion for flowers, FlowerSchool is here to support you every step of the way.
                </p>
                <Button 
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg font-semibold rounded-xl"
                  onClick={scrollToContact}
                  data-testid="button-enroll-now-hero"
                >
                  Enroll now
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Flower School</h2>
          <p className="text-xl text-gray-600">Master the art of floral design with expert guidance</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-8">
            <div className="text-sm font-medium text-gray-600 tracking-wider uppercase mb-4">
              WHY US
            </div>
            <h3 className="text-3xl md:text-4xl font-bold text-primary">The best learning experience</h3>
            
            <div className="space-y-8">
              <p className="text-lg text-gray-600 leading-relaxed">
                Welcome to Bouquet Bar's Programs page, where your floral journey begins. Discover our comprehensive courses and 
                workshops designed to inspire creativity, hone skills, and cultivate your passion for floral design.
              </p>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 text-xl">👨‍🏫</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Experienced Instructors</h4>
                    <p className="text-gray-600 text-sm">Learn from seasoned florists with years of industry experience</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 text-xl">✋</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Hands-On Learning</h4>
                    <p className="text-gray-600 text-sm">Gain practical skills through hands-on experience with a variety of flowers and materials</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <span className="text-orange-600 text-xl">📅</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Flexible Scheduling</h4>
                    <p className="text-gray-600 text-sm">Choose from a range of course options and schedules to fit your busy lifestyle</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <img 
              src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
              alt="Floral design class with instructor and students" 
              className="rounded-2xl shadow-2xl image-hover w-full" 
            />
          </div>
        </div>

        {/* Courses Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="card-shadow">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-4 animate-pulse" />
                    <div className="h-6 bg-muted rounded mb-2 animate-pulse" />
                    <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-4 animate-pulse" />
                    <div className="h-8 bg-muted rounded w-24 mx-auto mb-2 animate-pulse" />
                    <div className="h-4 bg-muted rounded w-32 mx-auto animate-pulse" />
                  </div>
                  <div className="space-y-2 mb-6">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="h-4 bg-muted rounded animate-pulse" />
                    ))}
                  </div>
                  <div className="h-10 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {courses.map((course) => {
              const IconComponent = getCourseIcon(course.title);
              return (
                <Card 
                  key={course.id} 
                  className={`card-shadow hover:shadow-xl transition-all ${course.popular ? 'border-2 border-primary relative' : ''}`}
                  data-testid={`card-course-${course.id}`}
                >
                  {course.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                    </div>
                  )}
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <IconComponent className="w-12 h-12 text-primary mb-4 mx-auto" />
                      <h3 className="text-xl font-bold mb-2" data-testid={`text-course-title-${course.id}`}>
                        {course.title}
                      </h3>
                      <p className="text-muted-foreground mb-4" data-testid={`text-course-description-${course.id}`}>
                        {course.description}
                      </p>
                      <div className="text-2xl font-bold text-primary mb-2" data-testid={`text-course-price-${course.id}`}>
                        ₹{parseFloat(course.price).toLocaleString('en-IN')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {course.duration} • {course.sessions} sessions
                      </div>
                    </div>
                    <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                      {(course.features as string[]).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="w-4 h-4 text-secondary mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full" 
                      variant={course.popular ? "default" : "secondary"}
                      onClick={scrollToContact}
                      data-testid={`button-enroll-${course.id}`}
                    >
                      Enroll Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Upcoming Batches */}
        <Card className="card-shadow mb-12">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-center mb-8">Upcoming Batches</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course) => (
                <div key={course.id} className="text-center p-6 bg-accent rounded-lg">
                  <div className="text-lg font-semibold mb-2">{course.title}</div>
                  <div className="text-muted-foreground mb-4">Starts: {course.nextBatch}</div>
                  <Button 
                    variant={course.popular ? "default" : "secondary"}
                    onClick={scrollToContact}
                    data-testid={`button-register-${course.id}`}
                  >
                    Register
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Download Brochure CTA */}
        <div className="text-center">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-secondary to-primary text-white hover:shadow-lg text-lg font-semibold"
            onClick={downloadBrochure}
            data-testid="button-download-brochure"
          >
            <Award className="w-5 h-5 mr-2" />
            Download Course Brochure (PDF)
          </Button>
        </div>
      </div>
    </section>
  );
}
