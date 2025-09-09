import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Clock, Users, BookOpen, Star, Calendar } from "lucide-react";
import type { Course } from "@shared/schema";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function SchoolPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    staleTime: 5 * 60 * 1000,
  });

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const enrollInCourse = (courseId: string, courseTitle: string) => {
    if (!enrolledCourses.includes(courseId)) {
      setEnrolledCourses([...enrolledCourses, courseId]);
      toast({
        title: "Enrollment Successful",
        description: `You have been enrolled in ${courseTitle}.`,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-lg"></div>
                <CardContent className="p-6 space-y-4">
                  <div className="h-6 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=1200&h=800&fit=crop&crop=center')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-6xl font-bold text-foreground mb-6 animate-fadeIn">
              Master Floral
              <span className="block text-5xl bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-2">
                Design Arts
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 animate-fadeIn" style={{ animationDelay: '200ms' }}>
              Transform your passion for flowers into professional expertise. Learn from master florists 
              in hands-on workshops that blend traditional techniques with contemporary design trends.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn" style={{ animationDelay: '400ms' }}>
              <Button size="lg" className="hover:scale-105 transition-all duration-300 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg" data-testid="button-explore-courses">
                🎓 Explore Courses
              </Button>
              <Button size="lg" variant="outline" className="hover:scale-105 transition-all duration-300 border-2 hover:border-emerald-300" data-testid="button-free-trial">
                ✨ Free Trial Class
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-12">

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-4 mb-8 items-center"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          <Badge variant="secondary" data-testid="badge-enrolled-count">
            Enrolled: {enrolledCourses.length}
          </Badge>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
        >
          <Card className="text-center p-6 bg-emerald-50/50 border-emerald-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4">
              <BookOpen className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-emerald-700">15+</h3>
            <p className="text-emerald-600 text-sm">Years of Experience</p>
          </Card>
          <Card className="text-center p-6 bg-rose-50/50 border-rose-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-rose-100 rounded-full mb-4">
              <Users className="h-6 w-6 text-rose-600" />
            </div>
            <h3 className="text-2xl font-bold text-rose-700">500+</h3>
            <p className="text-rose-600 text-sm">Students Trained</p>
          </Card>
          <Card className="text-center p-6 bg-amber-50/50 border-amber-200">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4">
              <Star className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-amber-700">4.9/5</h3>
            <p className="text-amber-600 text-sm">Student Rating</p>
          </Card>
        </motion.div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-lg transition-all duration-300 hover-elevate h-full flex flex-col">
                <div className="relative">
                  {course.popular && (
                    <Badge className="absolute top-4 left-4 bg-primary z-10">
                      Most Popular
                    </Badge>
                  )}
                  <div className="h-48 bg-gradient-to-br from-emerald-100 to-rose-100 rounded-t-lg flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-emerald-600" />
                  </div>
                </div>
                
                <CardHeader className="flex-grow">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-xl" data-testid={`text-title-${course.id}`}>
                      {course.title}
                    </CardTitle>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                  <CardDescription className="text-base mb-4" data-testid={`text-description-${course.id}`}>
                    {course.description}
                  </CardDescription>
                  
                  {/* Course Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{course.sessions} sessions</span>
                    </div>
                  </div>

                  {/* Next Batch */}
                  <div className="flex items-center text-sm text-emerald-600 mb-4">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Next batch: {course.nextBatch}</span>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-foreground">What you'll learn:</h4>
                    <ul className="space-y-1">
                      {(course.features as string[]).slice(0, 3).map((feature: string, idx: number) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start">
                          <div className="w-1 h-1 bg-primary rounded-full mt-2 mr-2 flex-shrink-0"></div>
                          {feature}
                        </li>
                      ))}
                      {(course.features as string[]).length > 3 && (
                        <li className="text-sm text-muted-foreground">
                          + {(course.features as string[]).length - 3} more topics
                        </li>
                      )}
                    </ul>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-bold text-primary" data-testid={`text-price-${course.id}`}>
                      ₹{parseFloat(course.price).toLocaleString()}
                    </span>
                    <Badge variant="outline">
                      {course.popular ? "Premium" : "Standard"}
                    </Badge>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button
                    className="w-full"
                    disabled={enrolledCourses.includes(course.id)}
                    onClick={() => enrollInCourse(course.id, course.title)}
                    data-testid={`button-enroll-${course.id}`}
                    variant={course.popular ? "default" : "outline"}
                  >
                    {enrolledCourses.includes(course.id) ? (
                      "Enrolled"
                    ) : (
                      "Enroll Now"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-muted-foreground text-lg" data-testid="text-no-courses">
              No courses found matching your criteria.
            </p>
          </motion.div>
        )}
        
        {/* Course Categories */}
        <section className="py-16 bg-muted mt-16 rounded-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 animate-fadeIn">
              Course Categories
            </h2>
            <p className="text-lg text-muted-foreground animate-fadeIn" style={{ animationDelay: '200ms' }}>
              Choose your learning path based on your interests and skill level
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                name: "Beginner Basics", 
                description: "Perfect for newcomers to floral design", 
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center", 
                icon: "🌱",
                courses: "5 Courses"
              },
              { 
                name: "Professional Certification", 
                description: "Advanced skills for commercial florists", 
                image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&h=300&fit=crop&crop=center", 
                icon: "🎓",
                courses: "8 Courses"
              },
              { 
                name: "Wedding Specialist", 
                description: "Specialized training for wedding arrangements", 
                image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=400&h=300&fit=crop&crop=center", 
                icon: "💐",
                courses: "6 Courses"
              }
            ].map((category, index) => (
              <Card 
                key={category.name} 
                className="group hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer animate-bounceIn overflow-hidden"
                style={{ animationDelay: `${index * 150}ms` }}
                data-testid={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-black">{category.courses}</Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground transition-all duration-200">
                    View Courses
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Success Stories */}
        <section className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 animate-fadeIn">
              Student Success Stories
            </h2>
            <p className="text-lg text-muted-foreground animate-fadeIn" style={{ animationDelay: '200ms' }}>
              See how our graduates have transformed their passion into successful careers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Priya Sharma", role: "Wedding Florist", story: "Started my own wedding decoration business after completing the certification course.", rating: 5 },
              { name: "Arjun Patel", role: "Flower Shop Owner", story: "The business skills taught here helped me expand my family flower shop into 3 locations.", rating: 5 },
              { name: "Meera Singh", role: "Event Designer", story: "Now working with top event management companies in Mumbai thanks to the professional training.", rating: 5 }
            ].map((story, index) => (
              <Card 
                key={story.name}
                className="p-6 hover:shadow-lg transition-all duration-300 animate-slideInLeft"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(story.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">"{story.story}"</p>
                <div>
                  <p className="font-semibold text-foreground">{story.name}</p>
                  <p className="text-sm text-muted-foreground">{story.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-16 p-8 bg-gradient-to-r from-emerald-50 to-rose-50 rounded-lg border"
        >
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Ready to Start Your Floral Journey?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Join our community of passionate floral designers. Whether you're starting your career 
            or enhancing your skills, we have the perfect course for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Contact Our Advisors
            </Button>
            <Button size="lg" variant="outline">
              Download Course Brochure
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Your Floral Journey?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of students who have transformed their love for flowers into rewarding careers. 
              Book a free consultation with our instructors today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="hover:scale-105 transition-all duration-300" data-testid="button-free-consultation">
                Book Free Consultation
              </Button>
              <Button size="lg" variant="outline" className="hover:scale-105 transition-all duration-300 border-white text-white hover:bg-white hover:text-emerald-500" data-testid="button-download-brochure">
                Download Brochure
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}