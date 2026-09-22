import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);
export const useCart = () => useContext(CartContext);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("campus_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("campus_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image_url: product.image_url,
          producer_name: product.producer_name,
          qty,
        },
      ];
    });
  };

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id, qty) =>
    setItems((prev) => (qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i))));
  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + (i.price || 0) * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}