import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
    productId: string | number;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
}

interface CartState {
    items: CartItem[];
    addItem: (item: CartItem) => void;
    removeItem: (productId: string | number) => void;
    updateQuantity: (productId: string | number, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (newItem) => {
                const items = get().items;
                const existingItem = items.find((item) => item.productId === newItem.productId);

                if (existingItem) {
                    set({
                        items: items.map((item) =>
                            item.productId === newItem.productId
                                ? { ...item, quantity: item.quantity + newItem.quantity }
                                : item
                        ),
                    });
                } else {
                    set({ items: [...items, newItem] });
                }
            },
            removeItem: (productId) => {
                set({ items: get().items.filter((item) => item.productId !== productId) });
            },
            updateQuantity: (productId, quantity) => {
                set({
                    items: get().items.map((item) =>
                        item.productId === productId ? { ...item, quantity: Math.max(0, quantity) } : item
                    ),
                });
            },
            clearCart: () => set({ items: [] }),
            getTotal: () => {
                return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);
