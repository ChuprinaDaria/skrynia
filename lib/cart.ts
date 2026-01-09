/**
 * Shopping Cart Management with localStorage
 */

export interface CartItem {
  id: string;
  productId: number;
  title: string;
  price: number;
  currency: string;
  quantity: number;
  image?: string;
  slug: string;
}

const CART_STORAGE_KEY = 'skrynia_cart';

export class CartManager {
  /**
   * Get all items from cart
   */
  static getItems(): CartItem[] {
    if (typeof window === 'undefined') return [];

    try {
      const cartData = localStorage.getItem(CART_STORAGE_KEY);
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('Error reading cart:', error);
      return [];
    }
  }

  /**
   * Save cart to localStorage
   */
  private static saveItems(items: CartItem[]): void {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));

      // Dispatch custom event for cart updates
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: items }));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  /**
   * Add item to cart
   */
  static addItem(item: Omit<CartItem, 'id'>): void {
    const items = this.getItems();
    const existingIndex = items.findIndex(i => i.productId === item.productId);

    if (existingIndex >= 0) {
      // Update quantity if item exists
      items[existingIndex].quantity += item.quantity;
    } else {
      // Add new item with generated ID
      const newItem: CartItem = {
        ...item,
        id: `${item.productId}-${Date.now()}`,
      };
      items.push(newItem);
    }

    this.saveItems(items);
  }

  /**
   * Update item quantity
   */
  static updateQuantity(itemId: string, quantity: number): void {
    const items = this.getItems();
    const item = items.find(i => i.id === itemId);

    if (item) {
      if (quantity <= 0) {
        this.removeItem(itemId);
      } else {
        item.quantity = quantity;
        this.saveItems(items);
      }
    }
  }

  /**
   * Remove item from cart
   */
  static removeItem(itemId: string): void {
    const items = this.getItems().filter(i => i.id !== itemId);
    this.saveItems(items);
  }

  /**
   * Clear entire cart
   */
  static clearCart(): void {
    this.saveItems([]);
  }

  /**
   * Get cart totals
   */
  static getTotals(): {
    subtotal: number;
    itemCount: number;
    shipping: number;
    total: number;
  } {
    const items = this.getItems();

    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    // Calculate shipping (free over 1000 PLN)
    const shipping = subtotal >= 1000 ? 0 : 50;

    const total = subtotal + shipping;

    return { subtotal, itemCount, shipping, total };
  }

  /**
   * Check if product is in cart
   */
  static isInCart(productId: number): boolean {
    return this.getItems().some(item => item.productId === productId);
  }

  /**
   * Get product quantity in cart
   */
  static getProductQuantity(productId: number): number {
    const item = this.getItems().find(i => i.productId === productId);
    return item ? item.quantity : 0;
  }
}
