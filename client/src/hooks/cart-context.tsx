import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { apiRequest } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  isLoading: boolean;
  error: string | null;
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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  userId?: string;
}

export function CartProvider({ children, userId }: CartProviderProps) {
  const [cart, setCart] = useState<CartState>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
    isLoading: false,
    error: null,
  });

  const calculateTotals = useCallback((items: CartItem[]) => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
    return { totalItems, totalPrice };
  }, []);

  // Load cart from backend or localStorage
  const loadCart = useCallback(async () => {
    if (userId) {
      // Authenticated user - load from backend
      setCart(prev => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await apiRequest(`/api/cart/${userId}`);
        const items = await response.json();
        const { totalItems, totalPrice } = calculateTotals(items);
        
        setCart({
          items,
          totalItems,
          totalPrice,
          isLoading: false,
          error: null,
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
        if (savedCart) {
          const items = JSON.parse(savedCart);
          const { totalItems, totalPrice } = calculateTotals(items);
          setCart({
            items,
            totalItems,
            totalPrice,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Error loading guest cart:', error);
      }
    }
  }, [userId, calculateTotals]);

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

        const { totalItems, totalPrice } = calculateTotals(newItems);
        
        // Save to localStorage
        saveGuestCart(newItems);
        
        return {
          ...prevCart,
          items: newItems,
          totalItems,
          totalPrice,
        };
      });
    }
  }, [userId, calculateTotals, loadCart, saveGuestCart]);

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
        const { totalItems, totalPrice } = calculateTotals(newItems);
        
        // Save to localStorage
        saveGuestCart(newItems);
        
        return {
          ...prevCart,
          items: newItems,
          totalItems,
          totalPrice,
        };
      });
    }
  }, [userId, calculateTotals, loadCart, saveGuestCart]);

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
        const { totalItems, totalPrice } = calculateTotals(newItems);
        
        // Save to localStorage
        saveGuestCart(newItems);
        
        return {
          ...prevCart,
          items: newItems,
          totalItems,
          totalPrice,
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