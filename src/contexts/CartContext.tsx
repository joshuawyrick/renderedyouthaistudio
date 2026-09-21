import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface CartItem {
  productId: string;
  variantId: string | null;
  title: string;
  size: string;
  color: string;
  unitPrice: number;
  quantity: number;
  imageUrl?: string;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId: string | null) => void;
  updateQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  clearCart: () => void;
}

const STORAGE_KEY = 'ry_cart_v1';

const CartContext = createContext<CartContextValue | undefined>(undefined);

const sameLine = (a: CartItem, productId: string, variantId: string | null) =>
  a.productId === productId && (a.variantId ?? null) === (variantId ?? null);

const readStored = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(readStored);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full or unavailable - cart simply won't persist */
    }
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

    return {
      items,
      itemCount,
      subtotal,
      addItem: (item) =>
        setItems((prev) => {
          const existing = prev.find((p) => sameLine(p, item.productId, item.variantId));
          if (existing) {
            return prev.map((p) =>
              sameLine(p, item.productId, item.variantId)
                ? { ...p, quantity: Math.min(99, p.quantity + item.quantity) }
                : p,
            );
          }
          return [...prev, item];
        }),
      removeItem: (productId, variantId) =>
        setItems((prev) => prev.filter((p) => !sameLine(p, productId, variantId))),
      updateQuantity: (productId, variantId, quantity) =>
        setItems((prev) =>
          quantity <= 0
            ? prev.filter((p) => !sameLine(p, productId, variantId))
            : prev.map((p) =>
                sameLine(p, productId, variantId)
                  ? { ...p, quantity: Math.min(99, quantity) }
                  : p,
              ),
        ),
      clearCart: () => setItems([]),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside a CartProvider');
  return ctx;
};
