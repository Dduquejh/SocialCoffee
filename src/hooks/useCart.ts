import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '../types/Product';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (slug: string) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity) => {
        const existing = get().items.find(i => i.product.productSlug === product.productSlug);
        if (existing) {
          set({
            items: get().items.map(i =>
              i.product.productSlug === product.productSlug
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, { product, quantity }] });
        }
      },
      removeItem: (slug) => {
        set({ items: get().items.filter(i => i.product.productSlug !== slug) });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () =>
        get().items.reduce((acc, i) => acc + i.product.productPrice * i.quantity, 0),
    }),
    {
      name: 'cart-storage', // nombre en localStorage
    }
  )
);
