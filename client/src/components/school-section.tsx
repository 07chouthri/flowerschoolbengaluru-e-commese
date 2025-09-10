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
    <section id="school" className="section-padding bg-accent/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Flower School</h2>
          <p className="text-xl text-muted-foreground">Master the art of floral design with expert guidance</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-8">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground">Why Choose Our School?</h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <UserCheck className="w-8 h-8 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold">Certified Expert Trainers</h4>
                  <p className="text-muted-foreground">Learn from internationally certified floral designers with 15+ years experience</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <HandHeart className="w-8 h-8 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold">Hands-on Practice</h4>
                  <p className="text-muted-foreground">Real flower arrangements, practical sessions, and portfolio building</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Award className="w-8 h-8 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold">International Certification</h4>
                  <p className="text-muted-foreground">Globally recognized certificates to boost your floral design career</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <Briefcase className="w-8 h-8 text-secondary mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-semibold">Career Support</h4>
                  <p className="text-muted-foreground">Job placement assistance and business setup guidance</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div className="relative overflow-hidden rounded-2xl bg-white/60 backdrop-blur-sm shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-2">
              <img 
                src="https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
                alt="Floral design class with instructor and students" 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              
              {/* Professional overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Educational badge */}
              <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Badge className="bg-white/95 text-black backdrop-blur-sm">Live Classes</Badge>
              </div>
              
              {/* Modern content overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-bold text-lg mb-2">Professional Floral Design Training</h3>
                <p className="text-sm opacity-90">Learn from expert instructors in hands-on workshops</p>
              </div>
              
              {/* Elegant border glow */}
              <div className="absolute inset-0 rounded-2xl ring-2 ring-white/30 group-hover:ring-purple-300/60 transition-all duration-500"></div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000"></div>
            </div>
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
