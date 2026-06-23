"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { ProductItem, CartItem } from "@/types/cart";

interface CartContextType {
  cartItems: CartItem[];
  wishlistItems: ProductItem[];
  addToCart: (product: ProductItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
  addToWishlist: (product: ProductItem) => void;
  removeFromWishlist: (productId: string) => void;
  clearWishlist: () => void;
  moveToCart: (productId: string) => void;
  isInCart: (productId: string) => boolean;
  isInWishlist: (productId: string) => boolean;
  mounted: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "keplans_cart";
const WISHLIST_STORAGE_KEY = "keplans_wishlist";

// Load from localStorage
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    loadFromStorage(CART_STORAGE_KEY, []),
  );
  const [wishlistItems, setWishlistItems] = useState<ProductItem[]>(() =>
    loadFromStorage(WISHLIST_STORAGE_KEY, []),
  );
  const [mounted, setMounted] = useState(false);

  // Mark as mounted (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Persist to localStorage on changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, mounted]);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, mounted]);

  const addToCart = useCallback((product: ProductItem) => {
    setCartItems((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [...prev, { ...product, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity < 1) {
        removeFromCart(productId);
        return;
      }
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === productId ? { ...item, quantity } : item,
        ),
      );
    },
    [removeFromCart],
  );

  const addToWishlist = useCallback((product: ProductItem) => {
    setWishlistItems((prev) => {
      if (prev.some((item) => item.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
  }, []);

  const moveToCart = useCallback(
    (productId: string) => {
      setWishlistItems((prev) => {
        const product = prev.find((item) => item.id === productId);
        if (product) {
          addToCart(product);
          return prev.filter((item) => item.id !== productId);
        }
        return prev;
      });
    },
    [addToCart],
  );

  const isInCart = useCallback(
    (productId: string) => cartItems.some((item) => item.id === productId),
    [cartItems],
  );

  const isInWishlist = useCallback(
    (productId: string) => wishlistItems.some((item) => item.id === productId),
    [wishlistItems],
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        addToCart,
        removeFromCart,
        clearCart,
        updateQuantity,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        moveToCart,
        isInCart,
        isInWishlist,
        mounted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
