import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Check,  } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiRequest } from '@/lib/api'; 
interface FrontCardProps {
  isVisible: boolean;
  onClose: () => void;
  onSubscribe: (email: string) => void;
}

export default function FrontCard({ isVisible, onClose, onSubscribe }: FrontCardProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    
    try {
  
      await apiRequest('POST', '/api/landing/email', { email });
      
      onSubscribe(email);
      setIsSubmitted(true);
      
      // Auto close after 3 seconds
      setTimeout(() => {
        onClose();
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
      
    } catch (error) {
      console.error('Subscription failed:', error);
      // Handle error (show error message to user)
      // You can add toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    setIsSubmitted(false);
    setEmail("");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md"
          >
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white to-pink-50/30">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200/20 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-200/20 rounded-full -translate-x-12 translate-y-12"></div>
              
              <CardHeader className="text-center relative z-10 pb-4">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <img 
                    src="/E_Commerce_Bouquet_Bar_Logo_1757433847861.png" 
                    alt="Blossom Studio Logo" 
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {isSubmitted ? "Welcome to Blossom Studio! 🌸" : "Get Flower Updates!"}
                </CardTitle>
              </CardHeader>

              <CardContent className="relative z-10">
                {!isSubmitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 pr-4 py-2 border-gray-300 focus:border-pink-500 focus:ring-pink-500"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting || !email.trim()}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Subscribing...
                        </div>
                      ) : (
                        "Subscribe Now"
                      )}
                    </Button>
                    
                    <p className="text-xs text-gray-500 text-center">
                      No spam, unsubscribe at any time
                    </p>
                  </form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <p className="text-green-600 font-semibold">
                      Successfully subscribed!
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Closing in 3 seconds...
                    </p>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}