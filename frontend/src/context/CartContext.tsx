"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { CartItem, CartContextType } from "../types/index";
import { AuthContext } from "./AuthContext";
import { db } from "../../firebase-config";
import { doc, setDoc, getDoc, onSnapshot } from "firebase/firestore";

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const fetchCart = async (uid: string) => {
    const cartRef = doc(db, "carts", uid);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      const data = cartSnap.data();
      setCartItems(data.cartItems || []);
    }
  };

  const saveCart = async (uid: string, items: CartItem[]) => {
    const cartRef = doc(db, "carts", uid);
    await setDoc(cartRef, { cartItems: items }, { merge: true });
  };

  useEffect(() => {
    if (user) {
      fetchCart(user.uid);
      const cartRef = doc(db, "carts", user.uid);
      const unsubscribe = onSnapshot(cartRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setCartItems(data.cartItems || []);
        }
      });
      return () => unsubscribe();
    } else {
      setCartItems([]);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      saveCart(user.uid, cartItems);
    }
  }, [cartItems, user]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.some((prevItem) => prevItem.id === item.id);
      if (!itemExists) {
        return [...prevItems, item];
      }
      return prevItems;
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
