import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Product, Address, DeliveryOption } from "@shared/schema";

interface CartItem extends Product {
  quantity: number;
}

interface AppliedCoupon {
  id: string;
  code: string;
  type: string;
  value: number;
  description?: string;
  maxDiscount?: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  appliedCoupon: AppliedCoupon | null;
  discountAmount: number;
  shippingAddress: Address | null;
  deliveryOption: DeliveryOption | null;
  deliveryCharge: number;
  finalAmount: number;
  isLoading: boolean;
  error: string | null;
  couponError: string | null;
}

interface CartContextType extends CartState {
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
  clearError: () => void;
  loadCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<{ success: boolean; discountAmount?: number }>;
  removeCoupon: () => void;
  clearCouponError: () => void;
  
  // Shipping address methods
  setShippingAddress: (address: Address | null) => void;
  clearShippingAddress: () => void;
  
  // Delivery option methods
  setDeliveryOption: (option: DeliveryOption | null) => void;
  loadDeliveryOptions: () => Promise<DeliveryOption[]>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  userId?: string;
}

export function CartProvider({ children, userId }: CartProviderProps) {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartState>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
    appliedCoupon: null,
    discountAmount: 0,
    shippingAddress: null,
    deliveryOption: null,
    deliveryCharge: 0,
    finalAmount: 0,
    isLoading: false,
    error: null,
    couponError: null,
  });

  const calculateTotals = useCallback((
    items: CartItem[], 
    coupon?: AppliedCoupon | null, 
    discountAmount: number = 0, 
    deliveryCharge: number = 0
  ) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    
    let recalculatedDiscount = discountAmount;
    
    if (coupon) {
      if (coupon.type === 'percentage') {
        // Recalculate percentage discount based on cart subtotal only (not including delivery)
        recalculatedDiscount = (totalPrice * coupon.value) / 100;
        
        // Apply maximum discount cap if specified
        if (coupon.maxDiscount && recalculatedDiscount > coupon.maxDiscount) {
          recalculatedDiscount = coupon.maxDiscount;
        }
      } else if (coupon.type === 'fixed') {
        // For fixed discounts, clamp to prevent negative amounts on subtotal
        recalculatedDiscount = Math.min(coupon.value, totalPrice);
      }
    }
    
    // Calculate final amount: subtotal - discount + delivery
    // Ensure the discounted subtotal is never negative
    const discountedSubtotal = Math.max(0, totalPrice - recalculatedDiscount);
    const finalAmount = discountedSubtotal + deliveryCharge;
    
    return { 
      totalItems, 
      totalPrice, 
      finalAmount, 
      recalculatedDiscount 
    };
  }, []);

  // Save/load coupon state for guest users (defined before loadCart to fix initialization order)
  const saveGuestCoupon = useCallback((coupon: AppliedCoupon | null, discountAmount: number = 0) => {
    if (!userId) {
      try {
        if (coupon) {
          localStorage.setItem('guest-coupon', JSON.stringify({ coupon, discountAmount }));
        } else {
          localStorage.removeItem('guest-coupon');
        }
      } catch (error) {
        console.error('Error saving guest coupon:', error);
      }
    }
  }, [userId]);

  const loadGuestCoupon = useCallback(() => {
    if (!userId) {
      try {
        const savedCoupon = localStorage.getItem('guest-coupon');
        if (savedCoupon) {
          return JSON.parse(savedCoupon);
        }
      } catch (error) {
        console.error('Error loading guest coupon:', error);
      }
    }
    return { coupon: null, discountAmount: 0 };
  }, [userId]);

  // Save/load shipping state for guest users
  const saveGuestShipping = useCallback((shippingAddress: Address | null, deliveryOption: DeliveryOption | null) => {
    if (!userId) {
      try {
        if (shippingAddress || deliveryOption) {
          localStorage.setItem('guest-shipping', JSON.stringify({ shippingAddress, deliveryOption }));
        } else {
          localStorage.removeItem('guest-shipping');
        }
      } catch (error) {
        console.error('Error saving guest shipping:', error);
      }
    }
  }, [userId]);

  const loadGuestShipping = useCallback(() => {
    if (!userId) {
      try {
        const savedShipping = localStorage.getItem('guest-shipping');
        if (savedShipping) {
          return JSON.parse(savedShipping);
        }
      } catch (error) {
        console.error('Error loading guest shipping:', error);
      }
    }
    return { shippingAddress: null, deliveryOption: null };
  }, [userId]);

  // Load cart from backend or localStorage
  const loadCart = useCallback(async () => {
    if (userId) {
      // Authenticated user - load from backend
      setCart(prev => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await apiRequest(`/api/cart/${userId}`);
        const items = await response.json();
        
        // Preserve existing coupon state and recalculate with new items
        setCart(prev => {
          const { totalItems, totalPrice, finalAmount, recalculatedDiscount } = calculateTotals(
            items, 
            prev.appliedCoupon, 
            prev.discountAmount
          );
          
          return {
            items,
            totalItems,
            totalPrice,
            appliedCoupon: prev.appliedCoupon,
            discountAmount: recalculatedDiscount,
            finalAmount,
            isLoading: false,
            error: null,
            couponError: prev.couponError,
          };
        });
      } catch (error) {
        console.error('Error loading cart:', error);
        setCart(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Failed to load cart' 
        }));
      }
    } else {
      // Guest user - load from localStorage
      try {
        const savedCart = localStorage.getItem('guest-cart');
        const { coupon, discountAmount } = loadGuestCoupon();
        
        if (savedCart) {
          const items = JSON.parse(savedCart);
          const { totalItems, totalPrice, finalAmount } = calculateTotals(items, coupon, discountAmount);
          setCart({
            items,
            totalItems,
            totalPrice,
            appliedCoupon: coupon,
            discountAmount,
            finalAmount,
            isLoading: false,
            error: null,
            couponError: null,
          });
          
          // Note: Coupon will be revalidated if user applies it again
          // We don't auto-revalidate to avoid infinite loops
        } else {
          setCart(prev => ({
            ...prev,
            appliedCoupon: null,
            discountAmount: 0,
            finalAmount: 0
          }));
        }
      } catch (error) {
        console.error('Error loading guest cart:', error);
      }
    }
  }, [userId, calculateTotals, loadGuestCoupon]);

  // Revalidate applied coupon when cart changes (Critical Issue 2)
  const revalidateAppliedCoupon = useCallback(async (newTotalPrice: number) => {
    if (!cart.appliedCoupon) return true;
    
    try {
      const response = await apiRequest('/api/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({
          code: cart.appliedCoupon.code,
          cartSubtotal: newTotalPrice,
          userId: userId || undefined
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (!result.valid) {
        // Remove invalid coupon and show toast notification
        setCart(prev => ({
          ...prev,
          appliedCoupon: null,
          discountAmount: 0,
          finalAmount: newTotalPrice,
          couponError: null
        }));
        
        // Clear coupon from localStorage for guests
        saveGuestCoupon(null);
        
        toast({
          title: "Coupon Removed",
          description: `Your coupon "${cart.appliedCoupon.code}" is no longer valid: ${result.error}`,
          variant: "destructive"
        });
        
        console.log(`[COUPON] Revalidation failed for ${cart.appliedCoupon.code}: ${result.error}`);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error revalidating coupon:', error);
      // On network error, keep coupon but log the issue
      return true;
    }
  }, [cart.appliedCoupon, userId, saveGuestCoupon, toast]);

  // Save guest cart to localStorage
  const saveGuestCart = useCallback((items: CartItem[]) => {
    if (!userId) {
      try {
        localStorage.setItem('guest-cart', JSON.stringify(items));
      } catch (error) {
        console.error('Error saving guest cart:', error);
      }
    }
  }, [userId]);


  const addToCart = useCallback(async (product: Product, quantity: number = 1) => {
    if (userId) {
      // Backend persistence for authenticated users
      setCart(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const response = await apiRequest(`/api/cart/${userId}/add`, {
          method: 'POST',
          body: JSON.stringify({ productId: product.id, quantity }),
          headers: { 'Content-Type': 'application/json' }
        });
        await response.json();
        
        // Reload cart after adding
        await loadCart();
        
        // Revalidate coupon after cart reload (Critical Issue 2)
        if (cart.appliedCoupon) {
          // Use a small delay to ensure cart has been reloaded
          setTimeout(async () => {
            const currentCart = await new Promise<CartState>(resolve => {
              setCart(current => {
                resolve(current);
                return current;
              });
            });
            await revalidateAppliedCoupon(currentCart.totalPrice);
          }, 100);
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        setCart(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Failed to add item to cart' 
        }));
      }
    } else {
      // Local state for guest users
      setCart(prevCart => {
        const existingItemIndex = prevCart.items.findIndex(item => item.id === product.id);
        
        let newItems: CartItem[];
        if (existingItemIndex > -1) {
          newItems = prevCart.items.map((item, index) => 
            index === existingItemIndex 
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          newItems = [...prevCart.items, { ...product, quantity }];
        }

        const { totalItems, totalPrice, finalAmount, recalculatedDiscount } = calculateTotals(
          newItems, 
          prevCart.appliedCoupon, 
          prevCart.discountAmount
        );
        
        // Save to localStorage
        saveGuestCart(newItems);
        
        // Revalidate coupon with new cart total (Critical Issue 2)
        const couponValidationPromise = prevCart.appliedCoupon 
          ? revalidateAppliedCoupon(totalPrice)
          : Promise.resolve(true);
        
        couponValidationPromise.then(isValid => {
          if (isValid) {
            // Save updated coupon if discount was recalculated and coupon is still valid
            if (prevCart.appliedCoupon && recalculatedDiscount !== prevCart.discountAmount) {
              saveGuestCoupon(prevCart.appliedCoupon, recalculatedDiscount);
            }
          }
        });
        
        return {
          ...prevCart,
          items: newItems,
          totalItems,
          totalPrice,
          discountAmount: recalculatedDiscount,
          finalAmount,
        };
      });
    }
  }, [userId, calculateTotals, loadCart, saveGuestCart, revalidateAppliedCoupon]);

  const removeFromCart = useCallback(async (productId: string) => {
    if (userId) {
      // Backend persistence for authenticated users
      setCart(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const response = await apiRequest(`/api/cart/${userId}/remove/${productId}`, {
          method: 'DELETE'
        });
        await response.json();
        
        // Reload cart after removing
        await loadCart();
        
        // Revalidate coupon after cart reload (Critical Issue 2)
        if (cart.appliedCoupon) {
          // Use a small delay to ensure cart has been reloaded
          setTimeout(async () => {
            const currentCart = await new Promise<CartState>(resolve => {
              setCart(current => {
                resolve(current);
                return current;
              });
            });
            await revalidateAppliedCoupon(currentCart.totalPrice);
          }, 100);
        }
      } catch (error) {
        console.error('Error removing from cart:', error);
        setCart(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Failed to remove item from cart' 
        }));
      }
    } else {
      // Local state for guest users
      setCart(prevCart => {
        const newItems = prevCart.items.filter(item => item.id !== productId);
        const { totalItems, totalPrice, finalAmount, recalculatedDiscount } = calculateTotals(
          newItems, 
          prevCart.appliedCoupon, 
          prevCart.discountAmount
        );
        
        // Save to localStorage
        saveGuestCart(newItems);
        
        // Revalidate coupon with new cart total (Critical Issue 2)
        const couponValidationPromise = prevCart.appliedCoupon 
          ? revalidateAppliedCoupon(totalPrice)
          : Promise.resolve(true);
        
        couponValidationPromise.then(isValid => {
          if (isValid) {
            // Save updated coupon if discount was recalculated and coupon is still valid
            if (prevCart.appliedCoupon && recalculatedDiscount !== prevCart.discountAmount) {
              saveGuestCoupon(prevCart.appliedCoupon, recalculatedDiscount);
            }
          }
        });
        
        return {
          ...prevCart,
          items: newItems,
          totalItems,
          totalPrice,
          discountAmount: recalculatedDiscount,
          finalAmount,
        };
      });
    }
  }, [userId, calculateTotals, loadCart, saveGuestCart, revalidateAppliedCoupon]);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (userId) {
      // Backend persistence for authenticated users
      setCart(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const response = await apiRequest(`/api/cart/${userId}/update`, {
          method: 'PUT',
          body: JSON.stringify({ productId, quantity }),
          headers: { 'Content-Type': 'application/json' }
        });
        await response.json();
        
        // Reload cart after updating
        await loadCart();
        
        // Revalidate coupon after cart reload (Critical Issue 2)
        if (cart.appliedCoupon) {
          // Use a small delay to ensure cart has been reloaded
          setTimeout(async () => {
            const currentCart = await new Promise<CartState>(resolve => {
              setCart(current => {
                resolve(current);
                return current;
              });
            });
            await revalidateAppliedCoupon(currentCart.totalPrice);
          }, 100);
        }
      } catch (error) {
        console.error('Error updating cart quantity:', error);
        setCart(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Failed to update cart item' 
        }));
      }
    } else {
      // Local state for guest users
      setCart(prevCart => {
        const newItems = prevCart.items.map(item =>
          item.id === productId ? { ...item, quantity } : item
        );
        const { totalItems, totalPrice, finalAmount, recalculatedDiscount } = calculateTotals(
          newItems, 
          prevCart.appliedCoupon, 
          prevCart.discountAmount
        );
        
        // Save to localStorage
        saveGuestCart(newItems);
        
        // Revalidate coupon with new cart total (Critical Issue 2)
        const couponValidationPromise = prevCart.appliedCoupon 
          ? revalidateAppliedCoupon(totalPrice)
          : Promise.resolve(true);
        
        couponValidationPromise.then(isValid => {
          if (isValid) {
            // Save updated coupon if discount was recalculated and coupon is still valid
            if (prevCart.appliedCoupon && recalculatedDiscount !== prevCart.discountAmount) {
              saveGuestCoupon(prevCart.appliedCoupon, recalculatedDiscount);
            }
          }
        });
        
        return {
          ...prevCart,
          items: newItems,
          totalItems,
          totalPrice,
          discountAmount: recalculatedDiscount,
          finalAmount,
        };
      });
    }
  }, [userId, calculateTotals, removeFromCart, loadCart, saveGuestCart]);

  const clearCart = useCallback(async () => {
    if (userId) {
      // Backend persistence for authenticated users
      setCart(prev => ({ ...prev, isLoading: true, error: null }));
      
      try {
        const response = await apiRequest(`/api/cart/${userId}/clear`, {
          method: 'DELETE'
        });
        await response.json();
        
        setCart(prev => ({
          ...prev,
          items: [],
          totalItems: 0,
          totalPrice: 0,
          appliedCoupon: null,
          discountAmount: 0,
          finalAmount: 0,
          isLoading: false,
          error: null,
        }));
      } catch (error) {
        console.error('Error clearing cart:', error);
        setCart(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'Failed to clear cart' 
        }));
      }
    } else {
      // Local state for guest users
      setCart(prev => ({
        ...prev,
        items: [],
        totalItems: 0,
        totalPrice: 0,
        appliedCoupon: null,
        discountAmount: 0,
        finalAmount: 0,
      }));
      
      // Clear localStorage
      try {
        localStorage.removeItem('guest-cart');
      } catch (error) {
        console.error('Error clearing guest cart:', error);
      }
    }
  }, [userId]);

  const getItemQuantity = useCallback((productId: string): number => {
    const item = cart.items.find(item => item.id === productId);
    return item?.quantity || 0;
  }, [cart.items]);

  const isInCart = useCallback((productId: string): boolean => {
    return cart.items.some(item => item.id === productId);
  }, [cart.items]);

  const clearError = useCallback(() => {
    setCart(prev => ({ ...prev, error: null }));
  }, []);

  const clearCouponError = useCallback(() => {
    setCart(prev => ({ ...prev, couponError: null }));
  }, []);

  // Apply coupon with backend validation
  const applyCoupon = useCallback(async (code: string): Promise<{ success: boolean; discountAmount?: number }> => {
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode) return { success: false };

    setCart(prev => ({ ...prev, isLoading: true, couponError: null }));

    try {
      const response = await apiRequest('/api/coupons/validate', {
        method: 'POST',
        body: JSON.stringify({
          code: trimmedCode,
          cartSubtotal: cart.totalPrice,
          userId: userId || undefined
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const result = await response.json();

      if (result.valid) {
        const { coupon, discountAmount, finalAmount } = result;
        
        setCart(prev => {
          const newCart = {
            ...prev,
            appliedCoupon: coupon,
            discountAmount,
            finalAmount,
            isLoading: false,
            couponError: null
          };
          
          // Save coupon for guest users
          saveGuestCoupon(coupon, discountAmount);
          return newCart;
        });
        
        console.log(`[COUPON] Successfully applied coupon ${trimmedCode}, discount: ₹${discountAmount}`);
        return { success: true, discountAmount };
      } else {
        setCart(prev => ({
          ...prev,
          isLoading: false,
          couponError: result.error || 'Invalid coupon code'
        }));
        return { success: false };
      }
    } catch (error) {
      console.error('Error applying coupon:', error);
      setCart(prev => ({
        ...prev,
        isLoading: false,
        couponError: 'Failed to validate coupon. Please try again.'
      }));
      return { success: false };
    }
  }, [cart.totalPrice, userId, saveGuestCoupon]);

  // Remove applied coupon
  const removeCoupon = useCallback(() => {
    setCart(prev => {
      const { totalItems, totalPrice, finalAmount } = calculateTotals(prev.items, null, 0, prev.deliveryCharge);
      return {
        ...prev,
        appliedCoupon: null,
        discountAmount: 0,
        finalAmount,
        couponError: null
      };
    });
    
    // Clear coupon from localStorage for guests
    saveGuestCoupon(null);
    console.log('[COUPON] Coupon removed');
  }, [calculateTotals, saveGuestCoupon]);

  // Shipping address methods
  const setShippingAddress = useCallback((address: Address | null) => {
    setCart(prev => {
      const { totalItems, totalPrice, finalAmount } = calculateTotals(
        prev.items, 
        prev.appliedCoupon, 
        prev.discountAmount,
        prev.deliveryCharge
      );
      
      const newCart = {
        ...prev,
        shippingAddress: address,
        totalItems,
        totalPrice,
        finalAmount
      };
      
      // Save shipping to localStorage for guests
      saveGuestShipping(address, prev.deliveryOption);
      return newCart;
    });
  }, [calculateTotals, saveGuestShipping]);

  const clearShippingAddress = useCallback(() => {
    setShippingAddress(null);
  }, [setShippingAddress]);

  // Delivery option methods
  const setDeliveryOption = useCallback((option: DeliveryOption | null) => {
    setCart(prev => {
      const deliveryCharge = option ? parseFloat(option.price) : 0;
      const { totalItems, totalPrice, finalAmount } = calculateTotals(
        prev.items, 
        prev.appliedCoupon, 
        prev.discountAmount,
        deliveryCharge
      );
      
      const newCart = {
        ...prev,
        deliveryOption: option,
        deliveryCharge,
        totalItems,
        totalPrice,
        finalAmount
      };
      
      // Save shipping to localStorage for guests
      saveGuestShipping(prev.shippingAddress, option);
      return newCart;
    });
  }, [calculateTotals, saveGuestShipping]);

  const loadDeliveryOptions = useCallback(async (): Promise<DeliveryOption[]> => {
    try {
      const response = await apiRequest('/api/delivery-options');
      const deliveryOptions = await response.json();
      return deliveryOptions;
    } catch (error) {
      console.error('Error loading delivery options:', error);
      toast({
        title: "Error",
        description: "Failed to load delivery options",
        variant: "destructive",
      });
      return [];
    }
  }, [toast]);

  // Load cart when component mounts or userId changes
  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const value: CartContextType = {
    ...cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    isInCart,
    clearError,
    loadCart,
    applyCoupon,
    removeCoupon,
    clearCouponError,
    setShippingAddress,
    clearShippingAddress,
    setDeliveryOption,
    loadDeliveryOptions,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}