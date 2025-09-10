import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, MessageCircle, PhoneCall, ShoppingBag, GraduationCap, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function ContactSection() {
  const [shopForm, setShopForm] = useState({
    customerName: '',
    phone: '',
    email: '',
    occasion: '',
    requirements: '',
  });

  const [enrollForm, setEnrollForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    courseId: '',
    batch: '',
    questions: '',
  });

  const { toast } = useToast();

  const shopOrderMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/orders', data),
    onSuccess: () => {
      toast({
        title: "Order Request Sent!",
        description: "We'll contact you soon to confirm your flower order.",
      });
      setShopForm({
        customerName: '',
        phone: '',
        email: '',
        occasion: '',
        requirements: '',
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send order request. Please try again.",
        variant: "destructive",
      });
    }
  });

  const enrollmentMutation = useMutation({
    mutationFn: (data: any) => apiRequest('POST', '/api/enrollments', data),
    onSuccess: () => {
      toast({
        title: "Enrollment Request Sent!",
        description: "We'll contact you soon with course details and batch information.",
      });
      setEnrollForm({
        fullName: '',
        email: '',
        phone: '',
        courseId: '',
        batch: '',
        questions: '',
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send enrollment request. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleShopSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    shopOrderMutation.mutate({
      ...shopForm,
      items: [],
      total: "0.00"
    });
  };

  const handleEnrollSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    enrollmentMutation.mutate(enrollForm);
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/919876543210?text=Hello! I would like to place a flower order.', '_blank');
  };

  const makeCall = () => {
    window.open('tel:+919876543210', '_self');
  };

  return (
    <section id="contact" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Get in Touch</h2>
          <p className="text-xl text-muted-foreground">Ready to order flowers or join our classes? We're here to help!</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Address</div>
                    <div className="text-muted-foreground">123 Flower Street, Indiranagar, Bengaluru - 560038, Karnataka</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Phone className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Phone</div>
                    <div className="text-muted-foreground">+91 98765 43210</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Mail className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Email</div>
                    <div className="text-muted-foreground">hello@bouquetbar.com</div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Clock className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <div className="font-semibold">Hours</div>
                    <div className="text-muted-foreground">Mon-Sat: 9AM-8PM, Sun: 10AM-6PM</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Quick Actions</h4>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={openWhatsApp}
                  data-testid="button-whatsapp"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp Order
                </Button>
                <Button 
                  onClick={makeCall}
                  data-testid="button-call"
                >
                  <PhoneCall className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="bg-muted rounded-xl h-64 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-4" />
                <p className="font-semibold">Google Maps Integration</p>
                <p className="text-sm">Interactive map showing our location</p>
              </div>
            </div>
          </div>

          {/* Contact Forms */}
          <div className="space-y-8">
            {/* Shop Contact Form */}
            <Card className="card-shadow">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <ShoppingBag className="w-5 h-5 text-primary mr-2" />
                  Order Flowers
                </h3>
                <form onSubmit={handleShopSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      placeholder="Your Name"
                      value={shopForm.customerName}
                      onChange={(e) => setShopForm(prev => ({ ...prev, customerName: e.target.value }))}
                      required
                      data-testid="input-shop-name"
                    />
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      value={shopForm.phone}
                      onChange={(e) => setShopForm(prev => ({ ...prev, phone: e.target.value }))}
                      required
                      data-testid="input-shop-phone"
                    />
                  </div>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={shopForm.email}
                    onChange={(e) => setShopForm(prev => ({ ...prev, email: e.target.value }))}
                    required
                    data-testid="input-shop-email"
                  />
                  <Select onValueChange={(value) => setShopForm(prev => ({ ...prev, occasion: value }))}>
                    <SelectTrigger data-testid="select-shop-occasion">
                      <SelectValue placeholder="Select Occasion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="birthday">Birthday</SelectItem>
                      <SelectItem value="anniversary">Anniversary</SelectItem>
                      <SelectItem value="wedding">Wedding</SelectItem>
                      <SelectItem value="corporate">Corporate Event</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Special Requirements"
                    rows={3}
                    value={shopForm.requirements}
                    onChange={(e) => setShopForm(prev => ({ ...prev, requirements: e.target.value }))}
                    data-testid="textarea-shop-requirements"
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={shopOrderMutation.isPending}
                    data-testid="button-shop-submit"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {shopOrderMutation.isPending ? 'Sending...' : 'Send Order Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* School Enrollment Form */}
            <Card className="card-shadow">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <GraduationCap className="w-5 h-5 text-secondary mr-2" />
                  Enroll in Course
                </h3>
                <form onSubmit={handleEnrollSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      placeholder="Full Name"
                      value={enrollForm.fullName}
                      onChange={(e) => setEnrollForm(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                      data-testid="input-enroll-name"
                    />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={enrollForm.email}
                      onChange={(e) => setEnrollForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      data-testid="input-enroll-email"
                    />
                  </div>
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={enrollForm.phone}
                    onChange={(e) => setEnrollForm(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    data-testid="input-enroll-phone"
                  />
                  <Select onValueChange={(value) => setEnrollForm(prev => ({ ...prev, courseId: value }))}>
                    <SelectTrigger data-testid="select-enroll-course">
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Floral Design Basics</SelectItem>
                      <SelectItem value="2">Professional Bouquet Making</SelectItem>
                      <SelectItem value="3">Garden Design & Care</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={(value) => setEnrollForm(prev => ({ ...prev, batch: value }))}>
                    <SelectTrigger data-testid="select-enroll-batch">
                      <SelectValue placeholder="Preferred Batch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="march-15-morning">March 15, 2024 - Morning</SelectItem>
                      <SelectItem value="march-20-evening">March 20, 2024 - Evening</SelectItem>
                      <SelectItem value="march-25-weekend">March 25, 2024 - Weekend</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Any questions or special requirements?"
                    rows={3}
                    value={enrollForm.questions}
                    onChange={(e) => setEnrollForm(prev => ({ ...prev, questions: e.target.value }))}
                    data-testid="textarea-enroll-questions"
                  />
                  <Button 
                    type="submit" 
                    variant="secondary"
                    className="w-full"
                    disabled={enrollmentMutation.isPending}
                    data-testid="button-enroll-submit"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {enrollmentMutation.isPending ? 'Sending...' : 'Submit Enrollment'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
