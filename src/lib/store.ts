import { create } from "zustand";

// ---------------------------------------------------------------------------
// Helpers – localStorage is only touched in the browser, never during SSR.
// Node 25 injects a broken localStorage global (typeof window === "undefined"
// but typeof localStorage === "object" with no methods), so we guard on both.
// ---------------------------------------------------------------------------
function readLS(key: string): string | null {
  if (typeof window === "undefined") return null;
  if (typeof localStorage === "undefined") return null;
  if (typeof localStorage.getItem !== "function") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLS(key: string, value: string): void {
  if (typeof window === "undefined") return;
  if (typeof localStorage === "undefined") return;
  if (typeof localStorage.setItem !== "function") return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // quota exceeded or unavailable – fail silently
  }
}

// ---------------------------------------------------------------------------
// Cart store
// ---------------------------------------------------------------------------
export type CartItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
};

type CartStore = {
  items: CartItem[];
  hydrated: boolean;
  hydrate: () => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

const CART_KEY = "paint-by-mahi-cart";

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    const raw = readLS(CART_KEY);
    const items: CartItem[] = raw ? (JSON.parse(raw) as CartItem[]) : [];
    set({ items, hydrated: true });
  },

  addItem: (item) => {
    const existing = get().items.find((i) => i.id === item.id);
    let next: CartItem[];
    if (existing) {
      next = get().items.map((i) =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      );
    } else {
      next = [...get().items, { ...item, quantity: 1 }];
    }
    set({ items: next });
    writeLS(CART_KEY, JSON.stringify(next));
  },

  removeItem: (id) => {
    const next = get().items.filter((i) => i.id !== id);
    set({ items: next });
    writeLS(CART_KEY, JSON.stringify(next));
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    const next = get().items.map((i) => (i.id === id ? { ...i, quantity } : i));
    set({ items: next });
    writeLS(CART_KEY, JSON.stringify(next));
  },

  clearCart: () => {
    set({ items: [] });
    writeLS(CART_KEY, JSON.stringify([]));
  },

  getTotalItems: () =>
    get().items.reduce((sum, item) => sum + item.quantity, 0),

  getTotalPrice: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
}));

// ---------------------------------------------------------------------------
// Wishlist store
// ---------------------------------------------------------------------------
type WishlistStore = {
  items: string[];
  hydrated: boolean;
  hydrate: () => void;
  toggleWishlist: (id: string) => void;
  isWishlisted: (id: string) => boolean;
};

const WISHLIST_KEY = "paint-by-mahi-wishlist";

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    const raw = readLS(WISHLIST_KEY);
    const items: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    set({ items, hydrated: true });
  },

  toggleWishlist: (id) => {
    const items = get().items;
    const next = items.includes(id)
      ? items.filter((i) => i !== id)
      : [...items, id];
    set({ items: next });
    writeLS(WISHLIST_KEY, JSON.stringify(next));
  },

  isWishlisted: (id) => get().items.includes(id),
}));

// ---------------------------------------------------------------------------
// Orders store — shared between checkout and admin
// ---------------------------------------------------------------------------
export type Order = {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  items: number;
  total: number;
  paymentMethod: string;
  paymentProof?: string;       // transaction ID / reference entered by buyer
  paymentCleared?: boolean;    // admin marks this true/false
  status: string;
  date: string;
  notes?: string;
};

type OrdersStore = {
  orders: Order[];
  hydrated: boolean;
  hydrate: () => void;
  addOrder: (order: Order) => void;
  updateStatus: (id: string, status: string) => void;
  updatePaymentCleared: (id: string, cleared: boolean) => void;
};

const ORDERS_KEY = "pbm_orders";

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  orders: [],
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    const raw = readLS(ORDERS_KEY);
    const orders: Order[] = raw ? (JSON.parse(raw) as Order[]) : [];
    set({ orders, hydrated: true });
  },

  addOrder: (order) => {
    const next = [order, ...get().orders];
    set({ orders: next });
    writeLS(ORDERS_KEY, JSON.stringify(next));
  },

  updateStatus: (id, status) => {
    const next = get().orders.map((o) => (o.id === id ? { ...o, status } : o));
    set({ orders: next });
    writeLS(ORDERS_KEY, JSON.stringify(next));
  },

  updatePaymentCleared: (id, cleared) => {
    const next = get().orders.map((o) => (o.id === id ? { ...o, paymentCleared: cleared } : o));
    set({ orders: next });
    writeLS(ORDERS_KEY, JSON.stringify(next));
  },
}));
export type UserSession = { name: string; email: string };

type UserSessionStore = {
  user: UserSession | null;
  hydrated: boolean;
  hydrate: () => void;
  logout: () => void;
};

const SESSION_KEY = "pbm_user_session";

export const useUserStore = create<UserSessionStore>((set, get) => ({
  user: null,
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    try {
      const raw =
        typeof window !== "undefined"
          ? sessionStorage.getItem(SESSION_KEY)
          : null;
      const user: UserSession | null = raw ? JSON.parse(raw) : null;
      set({ user, hydrated: true });
    } catch {
      set({ user: null, hydrated: true });
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(SESSION_KEY);
    }
    set({ user: null });
  },
}));
