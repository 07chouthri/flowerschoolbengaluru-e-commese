import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import logoPath from "@assets/E_Commerce_Bouquet_Bar_Logo_1757484444893.png";

export default function ForgotPassword() {
  const [formData, setFormData] = useState({
    contact: "",
    contactType: "email" // "email" or "phone"
  });
  const [countryCode, setCountryCode] = useState("+91");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: { contact: string; contactType: string }) => {
      return await apiRequest("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "OTP Sent!",
        description: `Verification code sent to your ${formData.contactType}`,
      });
      // Navigate to OTP verification with contact info
      setLocation(`/verify-otp?contact=${encodeURIComponent(formData.contact)}&type=${formData.contactType}`);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.contact) {
      toast({
        title: "Error",
        description: "Please enter your email or phone number",
        variant: "destructive",
      });
      return;
    }

    // Basic validation
    if (formData.contactType === "email" && !formData.contact.includes("@")) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    if (formData.contactType === "phone" && formData.contact.length < 10) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }

    forgotPasswordMutation.mutate({
      contact: formData.contactType === "phone" ? countryCode + formData.contact : formData.contact,
      contactType: formData.contactType,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData({
      contact: value,
      contactType: value.includes("@") ? "email" : "phone"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pink-200/80 via-rose-200/60 to-pink-300/80 relative overflow-hidden">
          <div className="flex flex-col justify-center px-12 relative z-10">
            <div className="text-white">
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Forgot Your
                <span className="block text-pink-600">Password?</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-pink-800">
                No worries! We'll send you a verification code to reset your password securely.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-pink-900">Email Verification</h3>
                    <p className="text-pink-700">Get OTP via email instantly</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-pink-900">SMS Verification</h3>
                    <p className="text-pink-700">Receive OTP via text message</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-pink-500/20 rounded-full blur-lg"></div>
          <div className="absolute top-1/2 right-10 w-16 h-16 bg-rose-400/30 rounded-full blur-md"></div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="text-center mb-8">
              <img src={logoPath} alt="Bouquet Bar Logo" className="h-24 w-auto mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
            </div>

            {/* Back Button */}
            <Link href="/signin">
              <Button variant="ghost" className="mb-6 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Button>
            </Link>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Forgot Password</CardTitle>
                <CardDescription className="text-gray-600">
                  Enter your email or phone number to receive a verification code
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="contact" className="text-gray-700 font-medium">
                      Email Address or Phone Number
                    </Label>
                    {formData.contactType === "email" ? (
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="contact"
                          name="contact"
                          type="email"
                          required
                          className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
                          placeholder="your.email@example.com"
                          value={formData.contact}
                          onChange={handleInputChange}
                          data-testid="input-contact"
                        />
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Select value={countryCode} onValueChange={setCountryCode}>
                          <SelectTrigger className="w-[100px] border-gray-200 focus:border-primary">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="+91">+91</SelectItem>
                            <SelectItem value="+1">+1</SelectItem>
                            <SelectItem value="+44">+44</SelectItem>
                            <SelectItem value="+65">+65</SelectItem>
                            <SelectItem value="+971">+971</SelectItem>
                            <SelectItem value="+86">+86</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="contact"
                            name="contact"
                            type="tel"
                            required
                            className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
                            placeholder="9876543210"
                            value={formData.contact}
                            onChange={handleInputChange}
                            data-testid="input-contact"
                          />
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      {formData.contactType === "email" 
                        ? "We'll send a verification code to your email" 
                        : "We'll send a verification code via SMS"}
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full font-semibold py-3 text-lg"
                    disabled={forgotPasswordMutation.isPending}
                    data-testid="button-send-otp"
                  >
                    {forgotPasswordMutation.isPending ? "Sending..." : "Send Verification Code"}
                  </Button>
                </form>

                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-gray-600">
                    Remember your password?{" "}
                    <Link href="/signin" className="text-primary hover:text-primary/80 font-semibold">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}