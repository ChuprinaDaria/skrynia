'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartManager, CartItem } from '@/lib/cart';
import { trackAddToCart } from '@/lib/facebook-conversions';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  subtotalBeforeDiscount: number;
  discountPercent: number;
  discountAmount: number;
  shipping: number;
  total: number;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart on mount - only on client side to avoid hydration mismatch
  useEffect(() => {
    setItems(CartManager.getItems());

    // Listen for cart updates
    const handleCartUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<CartItem[]>;
      setItems(customEvent.detail);
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const addItem = (item: Omit<CartItem, 'id'>) => {
    CartManager.addItem(item);
    setItems(CartManager.getItems()); // Update state
    setIsCartOpen(true); // Auto-open cart when item added
    
    const currency = item.currency || 'PLN';
    const priceCurrency = currency === 'zł' ? 'PLN' : currency;
    const itemValue = item.price * item.quantity;
    
    // Facebook Pixel: Track AddToCart event (client-side)
    // Використовуємо productId, оскільки item має тип Omit<CartItem, 'id'>
    if (typeof window !== 'undefined' && typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'AddToCart', {
        content_name: item.title,
        content_ids: [item.productId.toString()],
        content_type: 'product',
        value: itemValue,
        currency: priceCurrency,
      });
    }
    
    // Google Analytics: Track add_to_cart event
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      (window as any).gtag('event', 'add_to_cart', {
        currency: priceCurrency,
        value: itemValue,
        items: [{
          item_id: item.productId.toString(),
          item_name: item.title,
          item_category: item.category || 'jewelry',
          price: item.price,
          quantity: item.quantity,
        }],
      });
    }
    
    // Facebook Conversions API: Track AddToCart event (server-side)
    trackAddToCart({
      content_name: item.title,
      content_ids: [item.productId.toString()],
      value: itemValue,
      currency: priceCurrency,
    }).catch(() => {
      // Fail silently
    });
  };

  const removeItem = (itemId: string) => {
    CartManager.removeItem(itemId);
    setItems(CartManager.getItems()); // Update state
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    CartManager.updateQuantity(itemId, quantity);
    setItems(CartManager.getItems()); // Update state
  };

  const clearCart = () => {
    CartManager.clearCart();
    setItems([]); // Update state
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  // Calculate totals - recalculate when items change
  // Use items directly instead of CartManager.getTotals() to avoid hydration mismatch
  const totals = React.useMemo(() => {
    const subtotalBeforeDiscount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    // Calculate progressive discount
    let discountPercent = 0;
    if (itemCount >= 3) {
      discountPercent = 15;
    } else if (itemCount >= 2) {
      discountPercent = 10;
    }

    const discountAmount = (subtotalBeforeDiscount * discountPercent) / 100;
    const subtotal = subtotalBeforeDiscount - discountAmount;

    // Calculate shipping (free over 1000 PLN after discount)
    const shipping = subtotal >= 1000 ? 0 : 50;
    const total = subtotal + shipping;

    return {
      subtotal,
      subtotalBeforeDiscount,
      itemCount,
      discountPercent,
      discountAmount,
      shipping,
      total,
    };
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount: totals.itemCount,
        subtotal: totals.subtotal,
        subtotalBeforeDiscount: totals.subtotalBeforeDiscount,
        discountPercent: totals.discountPercent,
        discountAmount: totals.discountAmount,
        shipping: totals.shipping,
        total: totals.total,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
