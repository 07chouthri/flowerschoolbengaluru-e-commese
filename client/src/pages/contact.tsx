import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Heart, Star } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6 animate-fadeIn">
            Contact Us
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fadeIn" style={{ animationDelay: '200ms' }}>
            We'd love to hear from you! Whether you need a custom arrangement or have questions about our floral design courses, we're here to help.
          </p>
          <Badge 
            variant="secondary" 
            className="text-lg px-4 py-2 animate-fadeIn hover:scale-105 transition-transform"
            style={{ animationDelay: '400ms' }}
            data-testid="badge-response-time"
          >
            ⚡ We respond within 2 hours
          </Badge>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="animate-slideInLeft">
                <h2 className="text-3xl font-bold text-foreground mb-6">
                  Get In Touch
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Visit our beautiful flower shop in the heart of Bengaluru or reach out to us through any of these channels.
                </p>
              </div>

              <div className="space-y-6">
                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slideInLeft" style={{ animationDelay: '200ms' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900 rounded-full flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-rose-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground" data-testid="text-address-title">Visit Our Shop</h3>
                        <p className="text-muted-foreground" data-testid="text-address">
                          123 Brigade Road, Bengaluru<br />
                          Karnataka 560001, India
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slideInLeft" style={{ animationDelay: '400ms' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <Phone className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground" data-testid="text-phone-title">Call Us</h3>
                        <p className="text-muted-foreground" data-testid="text-phone">
                          +91 98765 43210<br />
                          +91 80 2345 6789
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slideInLeft" style={{ animationDelay: '600ms' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <Mail className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground" data-testid="text-email-title">Email Us</h3>
                        <p className="text-muted-foreground" data-testid="text-email">
                          info@bouquetbar.com<br />
                          orders@bouquetbar.com
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-all duration-300 hover:scale-105 animate-slideInLeft" style={{ animationDelay: '800ms' }}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <Clock className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground" data-testid="text-hours-title">Business Hours</h3>
                        <p className="text-muted-foreground" data-testid="text-hours">
                          Mon-Sat: 9:00 AM - 8:00 PM<br />
                          Sunday: 10:00 AM - 6:00 PM
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Contact Form */}
            <div className="animate-slideInRight">
              <Card className="hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl text-foreground flex items-center space-x-2">
                    <MessageSquare className="h-6 w-6 text-rose-500" />
                    <span>Send Us a Message</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        First Name *
                      </label>
                      <Input 
                        placeholder="Enter your first name" 
                        className="transition-all duration-200 focus:scale-105"
                        data-testid="input-first-name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Last Name *
                      </label>
                      <Input 
                        placeholder="Enter your last name" 
                        className="transition-all duration-200 focus:scale-105"
                        data-testid="input-last-name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Email Address *
                    </label>
                    <Input 
                      type="email" 
                      placeholder="Enter your email address" 
                      className="transition-all duration-200 focus:scale-105"
                      data-testid="input-email"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Phone Number
                    </label>
                    <Input 
                      type="tel" 
                      placeholder="Enter your phone number" 
                      className="transition-all duration-200 focus:scale-105"
                      data-testid="input-phone"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Subject *
                    </label>
                    <Input 
                      placeholder="What can we help you with?" 
                      className="transition-all duration-200 focus:scale-105"
                      data-testid="input-subject"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Message *
                    </label>
                    <Textarea 
                      placeholder="Tell us more about your requirements..." 
                      rows={6} 
                      className="transition-all duration-200 focus:scale-105"
                      data-testid="textarea-message"
                    />
                  </div>

                  <Button 
                    size="lg" 
                    className="w-full hover:scale-105 transition-all duration-200 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
                    data-testid="button-send-message"
                  >
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    We'll get back to you within 2 hours during business hours.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 animate-fadeIn">
              Need Something Specific?
            </h2>
            <p className="text-lg text-muted-foreground animate-fadeIn" style={{ animationDelay: '200ms' }}>
              Choose the best way to reach us based on your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fadeIn" style={{ animationDelay: '300ms' }}>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-rose-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Custom Orders</h3>
                <p className="text-muted-foreground mb-6">
                  Need a special arrangement? Let us create something unique for your occasion.
                </p>
                <Button variant="outline" className="hover:scale-105 transition-transform" data-testid="button-custom-order">
                  Place Custom Order
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fadeIn" style={{ animationDelay: '500ms' }}>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Course Inquiry</h3>
                <p className="text-muted-foreground mb-6">
                  Interested in learning floral design? Get information about our courses.
                </p>
                <Button variant="outline" className="hover:scale-105 transition-transform" data-testid="button-course-inquiry">
                  Course Information
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fadeIn" style={{ animationDelay: '700ms' }}>
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">WhatsApp Chat</h3>
                <p className="text-muted-foreground mb-6">
                  Get instant support via WhatsApp for quick questions and orders.
                </p>
                <Button variant="outline" className="hover:scale-105 transition-transform" data-testid="button-whatsapp">
                  Chat on WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4 animate-fadeIn">
              Find Us Here
            </h2>
            <p className="text-lg text-muted-foreground animate-fadeIn" style={{ animationDelay: '200ms' }}>
              Located in the heart of Bengaluru, easily accessible by public transport
            </p>
          </div>

          <div className="bg-muted rounded-lg p-8 text-center">
            <div className="w-full h-64 bg-gradient-to-r from-rose-100 to-pink-100 dark:from-gray-800 dark:to-gray-700 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-rose-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Interactive Map</h3>
                <p className="text-muted-foreground">
                  123 Brigade Road, Bengaluru, Karnataka 560001
                </p>
                <Button className="mt-4 hover:scale-105 transition-transform" data-testid="button-get-directions">
                  Get Directions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}