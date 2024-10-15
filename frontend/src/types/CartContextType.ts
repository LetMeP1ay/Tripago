import { CartItem } from "./CartItem";

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, type: "flight" | "hotel") => void;
}
