import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      // State
      items: [],

      // Actions
      addItem: (product, rentalDays = 3, calculatedRentFee = null) => {
        const { items } = get();
        const existingItemIndex = items.findIndex((item) => item._id === product._id);
        const rentFee = calculatedRentFee !== null ? calculatedRentFee : (product.rentalPrice || product.price || 0) * rentalDays;

        if (existingItemIndex >= 0) {
          // If item exists, update its rental days and fee
          const updatedItems = [...items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            rentalDays,
            rentFee,
            quantity: 1 // enforce 1
          };
          set({ items: updatedItems });
        } else {
          // Add new item
          set({
            items: [...items, { ...product, quantity: 1, rentalDays, rentFee }],
          });
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter((item) => item._id !== productId),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      // Getters
      getItemCount: () => {
        return get().items.length; // 1 per item
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + (item.rentFee || (item.rentalPrice || item.price || 0) * item.rentalDays),
          0
        );
      },

      getTotalUpfront: () => {
        return get().items.reduce(
          (total, item) => total + (item.depositAmount || 0),
          0
        );
      },

      getTotal: (discount = 0, shipping = 0) => {
        const subtotal = get().getSubtotal();
        return subtotal - discount + shipping;
      },
    }),
    {
      name: "cart-storage", // localStorage key
    }
  )
);
