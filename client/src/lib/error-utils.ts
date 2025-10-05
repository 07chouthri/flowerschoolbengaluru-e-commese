/**
 * Utility functions for handling errors and providing user-friendly messages
 */

export interface ErrorWithStatus {
  status?: number;
  message?: string;
  code?: string;
}

/**
 * Converts technical errors into user-friendly messages
 */
export const getFriendlyErrorMessage = (error: any, context?: string): string => {
  // If it's a response error with status
  if (error?.status) {
    switch (error.status) {
      case 400:
        return "Invalid information provided. Please check your input and try again.";
      case 401:
        return context === "signin" 
          ? "Incorrect email or password. Please check your credentials and try again."
          : "You need to sign in to access this feature.";
      case 403:
        return "You don't have permission to perform this action.";
      case 404:
        return context === "signin" 
          ? "Account not found. Please check your email or create a new account."
          : "The requested information could not be found.";
      case 409:
        return context === "signup"
          ? "An account with this email already exists. Please sign in or use a different email."
          : "This information already exists. Please try with different details.";
      case 422:
        return "Please check your information and try again.";
      case 429:
        return "Too many attempts. Please wait a few minutes before trying again.";
      case 500:
        return "Our servers are experiencing issues. Please try again in a few moments.";
      case 502:
      case 503:
      case 504:
        return "Service temporarily unavailable. Please try again later.";
      default:
        return "Something went wrong. Please try again.";
    }
  }

  // Check for specific error messages from the server
  const errorMessage = error?.message?.toLowerCase() || "";
  
  // Authentication related errors
  if (errorMessage.includes("password") || errorMessage.includes("credential")) {
    return "Incorrect email or password. Please check your credentials and try again.";
  }
  
  if (errorMessage.includes("user not found") || errorMessage.includes("email not found")) {
    return "Account not found. Please check your email or create a new account.";
  }
  
  if (errorMessage.includes("account disabled") || errorMessage.includes("suspended")) {
    return "Your account has been temporarily disabled. Please contact support for assistance.";
  }
  
  if (errorMessage.includes("verification") || errorMessage.includes("verify")) {
    return "Please verify your email address before continuing. Check your inbox for a verification link.";
  }

  // Registration/signup related errors
  if (errorMessage.includes("email already exists") || errorMessage.includes("already registered")) {
    return "An account with this email already exists. Please sign in or use a different email.";
  }

  if (errorMessage.includes("weak password") || errorMessage.includes("password strength")) {
    return "Please choose a stronger password with at least 8 characters, including letters and numbers.";
  }

  // Network and connection errors
  if (errorMessage.includes("network") || errorMessage.includes("connection") || errorMessage.includes("fetch")) {
    return "Connection issue detected. Please check your internet connection and try again.";
  }

  if (errorMessage.includes("timeout")) {
    return "Request timed out. Please check your connection and try again.";
  }

  // Validation errors
  if (errorMessage.includes("validation") || errorMessage.includes("invalid")) {
    return "Please check your information and try again.";
  }

  // Default friendly message for any other error
  return "Something went wrong. Please try again, and contact support if the problem persists.";
};

/**
 * Validates email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates password strength
 */
export const validatePassword = (password: string): { isValid: boolean; message: string } => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long."
    };
  }

  if (password.length < 8) {
    return {
      isValid: true,
      message: "Consider using a longer password for better security."
    };
  }

  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasLetter || !hasNumber) {
    return {
      isValid: false,
      message: "Password should include both letters and numbers for better security."
    };
  }

  return {
    isValid: true,
    message: hasSpecial ? "Strong password!" : "Good password! Consider adding special characters for extra security."
  };
};

/**
 * Validates phone number format
 */
export const isValidPhone = (phone: string): boolean => {
  // Remove all non-digit characters for validation
  const cleanPhone = phone.replace(/\D/g, '');
  // Check if it's between 7-15 digits (international standards)
  return cleanPhone.length >= 7 && cleanPhone.length <= 15;
};

/**
 * Common form validation messages
 */
export const validationMessages = {
  required: (field: string) => `${field} is required.`,
  email: "Please enter a valid email address (e.g., you@example.com).",
  phone: "Please enter a valid phone number.",
  name: "Please enter a valid name (at least 2 characters).",
  passwordMatch: "Passwords do not match. Please check and try again.",
  passwordLength: "Password must be at least 6 characters long.",
  required_field: "This field is required.",
};

/**
 * Logs errors for debugging while showing friendly messages to users
 */
export const logError = (error: any, context?: string) => {
  console.error(`Error in ${context || 'application'}:`, {
    message: error?.message,
    status: error?.status,
    stack: error?.stack,
    timestamp: new Date().toISOString(),
  });
};