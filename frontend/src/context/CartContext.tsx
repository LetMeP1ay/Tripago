"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { CartItem, CartContextType } from "../types";
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void;

    const fetchCart = async () => {
      if (user) {
        const cartRef = doc(db, "carts", user.uid);

        unsubscribe = onSnapshot(
          cartRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setCartItems(data.cartItems || []);
            } else {
              setCartItems([]);
            }
            setIsInitialLoad(false);
          },
          (error) => {
            console.error("Error fetching cart data:", error);
          }
        );
      } else {
        setCartItems([]);
        setIsInitialLoad(false);
      }
    };

    fetchCart();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  useEffect(() => {
    const saveCartToFirestore = async () => {
      if (user && !isInitialLoad) {
        try {
          const cartRef = doc(db, "carts", user.uid);

          const cartSnap = await getDoc(cartRef);
          const currentData = cartSnap.exists()
            ? cartSnap.data().cartItems || []
            : [];

          if (JSON.stringify(currentData) !== JSON.stringify(cartItems)) {
            await setDoc(cartRef, { cartItems }, { merge: true });
          }
        } catch (error) {
          console.error("Error saving cart data:", error);
        }
      }
    };

    saveCartToFirestore();
  }, [cartItems]);

  const addToCart = (item: CartItem) => {
    setCartItems((prevItems) => {
      const itemExists = prevItems.some(
        (prevItem) => prevItem.id === item.id && prevItem.type === item.type
      );
      if (!itemExists) {
        return [...prevItems, item];
      }
      return prevItems;
    });
  };

  const removeFromCart = (id: string, type: "flight" | "hotel") => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !(item.id === id && item.type === type))
    );
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
