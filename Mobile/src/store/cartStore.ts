import { create } from "zustand";

export interface CartItem {
  id: string;
  foodId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  restaurantId: string;
  restaurantName: string;
}

interface CartState {
  items: CartItem[];
  promoCode: string;
  promoDiscount: number;
  addItem: (item: Omit<CartItem, "id" | "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  applyPromo: (code: string) => boolean;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getCount: () => number;
}

const PROMO_CODES: Record<string, number> = {
  FOOD50: 0.5,
  FIRST10: 0.1,
  SAVE20: 0.2,
};

const DELIVERY_FEE = 1.99;

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  promoCode: "",
  promoDiscount: 0,

  addItem: (item) => {
    set((state) => {
      const existing = state.items.find((i) => i.foodId === item.foodId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        items: [
          ...state.items,
          { ...item, id: `${item.foodId}-${Date.now()}`, quantity: 1 },
        ],
      };
    });
  },

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  updateQuantity: (id, qty) => {
    if (qty <= 0) {
      get().removeItem(id);
      return;
    }
    set((state) => ({
      items: state.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
    }));
  },

  applyPromo: (code) => {
    const discount = PROMO_CODES[code.toUpperCase()];
    if (discount) {
      set({ promoCode: code.toUpperCase(), promoDiscount: discount });
      return true;
    }
    return false;
  },

  clearCart: () => set({ items: [], promoCode: "", promoDiscount: 0 }),

  getSubtotal: () =>
    get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

  getTotal: () => {
    const sub = get().getSubtotal();
    const discount = sub * get().promoDiscount;
    const delivery = get().items.length > 0 ? DELIVERY_FEE : 0;
    return Math.max(0, sub - discount + delivery);
  },

  getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
