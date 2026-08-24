"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  priceTotalXaf: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  relayPointId: string | null;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  setRelayPoint: (relayPointId: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      relayPointId: null,
      addItem: (item, quantity = 1) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity }] });
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((i) => i.productId !== productId) }),
      setQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.productId !== productId) });
          return;
        }
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i
          ),
        });
      },
      setRelayPoint: (relayPointId) => set({ relayPointId }),
      clear: () => set({ items: [], relayPointId: null }),
    }),
    { name: "okoumia-cart" }
  )
);

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.priceTotalXaf * i.quantity, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
