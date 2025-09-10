import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useLocation } from "wouter";
import { ArrowLeft, User, Mail, Phone, Lock, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import logoPath from "@assets/E_Commerce_Bouquet_Bar_Logo_1757484444893.png";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    otp: ""
  });
  const [countryCode, setCountryCode] = useState("+91");
  const [step, setStep] = useState<"details" | "otp">("details");
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const signupMutation = useMutation({
    mutationFn: async (userData: { firstName: string; lastName: string; phone: string }) => {
      return await apiRequest("/api/auth/send-signup-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "OTP Sent! 📱",
        description: "Check your phone for the verification code.",
      });
      setStep("otp");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send OTP",
        variant: "destructive",
      });
    },
  });

  const verifySignupMutation = useMutation({
    mutationFn: async (data: { firstName: string; lastName: string; phone: string; otp: string }) => {
      return await apiRequest("/api/auth/verify-signup-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Account Created! 🎉",
        description: "You can now sign in with your phone number.",
      });
      setLocation("/signin");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    },
  });

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const fullPhone = countryCode + formData.phone;
    signupMutation.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: fullPhone,
    });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.otp || formData.otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter the 6-digit OTP",
        variant: "destructive",
      });
      return;
    }

    const fullPhone = countryCode + formData.phone;
    verifySignupMutation.mutate({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: fullPhone,
      otp: formData.otp,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100">
      <div className="flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-pink-200/80 via-rose-200/60 to-pink-300/80 relative overflow-hidden">
          <div className="flex flex-col justify-center px-12 relative z-10">
            <div className="mb-8">
              <img src={logoPath} alt="Bouquet Bar Logo" className="h-28 w-auto mb-6" />
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Join Bouquet Bar
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Start your journey in professional floral design and access premium flower collections.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Shop Premium Flowers</h3>
                  <p className="text-gray-600">Fresh flowers delivered to your door</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Premium Access</h3>
                  <p className="text-gray-600">Exclusive courses and flower collections</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <img src={logoPath} alt="Bouquet Bar Logo" className="h-24 w-auto mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Join Bouquet Bar</h2>
            </div>

            {/* Back Button */}
            <Link href="/">
              <Button variant="ghost" className="mb-6 text-gray-600 hover:text-gray-900" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>

            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold text-gray-900">Create Account</CardTitle>
                <CardDescription className="text-gray-600">
                  {step === "details" ? "Enter your details to get started" : "Verify your phone number"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {step === "details" ? (
                  <form onSubmit={handleSendOtp} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-gray-700 font-medium">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
                            placeholder="First name"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            data-testid="input-first-name"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
                            placeholder="Last name"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            data-testid="input-last-name"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
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
                          </SelectContent>
                        </Select>
                        <div className="relative flex-1">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            className="pl-10 border-gray-200 focus:border-primary focus:ring-primary/20"
                            placeholder="98765 43210"
                            value={formData.phone}
                            onChange={handleInputChange}
                            data-testid="input-phone"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        We'll send you a verification code via SMS
                      </p>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full text-lg py-3 h-auto font-semibold"
                      disabled={signupMutation.isPending}
                      data-testid="button-send-signup-otp"
                    >
                      {signupMutation.isPending ? "Sending OTP..." : "Send OTP"}
                    </Button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-5">
                    <div className="text-center space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900">Verify Your Phone</h3>
                      <p className="text-sm text-gray-600">
                        Enter the 6-digit code sent to {countryCode} {formData.phone}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-gray-700 font-medium">Verification Code</Label>
                      <Input
                        id="otp"
                        name="otp"
                        type="text"
                        maxLength={6}
                        required
                        className="text-center text-lg tracking-widest border-gray-200 focus:border-primary focus:ring-primary/20"
                        placeholder="000000"
                        value={formData.otp}
                        onChange={handleInputChange}
                        data-testid="input-signup-otp"
                      />
                    </div>

                    <div className="space-y-3">
                      <Button 
                        type="submit" 
                        className="w-full font-semibold py-3 text-lg"
                        disabled={verifySignupMutation.isPending}
                        data-testid="button-verify-signup-otp"
                      >
                        {verifySignupMutation.isPending ? "Creating Account..." : "Verify & Create Account"}
                      </Button>

                      <Button 
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setStep("details");
                          setFormData({ ...formData, otp: "" });
                        }}
                        data-testid="button-change-details"
                      >
                        Change Details
                      </Button>
                    </div>

                    <div className="text-center">
                      <button
                        type="button"
                        className="text-sm text-primary hover:text-primary/80 font-medium"
                        onClick={() => signupMutation.mutate({
                          firstName: formData.firstName,
                          lastName: formData.lastName,
                          phone: countryCode + formData.phone,
                        })}
                        disabled={signupMutation.isPending}
                        data-testid="button-resend-signup-otp"
                      >
                        {signupMutation.isPending ? "Sending..." : "Resend OTP"}
                      </button>
                    </div>
                  </form>
                )}


                <div className="text-center pt-4 border-t border-gray-100">
                  <p className="text-gray-600">
                    Already have an account?{" "}
                    <Link href="/signin" className="text-primary hover:text-primary/80 font-semibold">
                      Sign In
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