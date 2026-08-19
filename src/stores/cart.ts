/**
 * Cart Store
 *
 * Zustand store with localStorage persistence for the shopping cart.
 * Works across all templates - each template styles the cart UI differently
 * but shares this same state management.
 *
 * SSR-safe: returns empty state on the server; hydrates from localStorage
 * on the client.
 */

'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  productId: number;
  slug: string;
  name: string;
  price: number;           // in cents
  compareAtPrice?: number | null;
  image?: string;          // URL
  quantity: number;
  currency?: string;
};

type CartStore = {
  items: CartItem[];

  /** Add a product to the cart. If already present, increments quantity by 1. */
  addItem: (item: Omit<CartItem, 'quantity'>) => void;

  /** Remove a product entirely from the cart. */
  removeItem: (productId: number) => void;

  /** Set the quantity for a specific product. Removes if set to 0. */
  updateQuantity: (productId: number, quantity: number) => void;

  /** Empty the entire cart (e.g. after successful checkout). */
  clearCart: () => void;

  /** Sum of all item quantities. */
  totalItems: () => number;

  /** Sum of (price  quantity) for all items, in cents. */
  totalPrice: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId
                  ? { ...i, quantity: i.quantity + 1 }
                  : i,
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: 1 }],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.productId !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          set((state) => ({
            items: state.items.filter((i) => i.productId !== productId),
          }));
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity } : i,
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      totalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: 'chameleon-cart',
    },
  ),
);
