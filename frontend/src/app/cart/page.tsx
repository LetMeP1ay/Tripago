"use client";

import { useContext } from "react";
import FlightDetails from "@/components/FlightDetails";
import HotelCard from "@/components/HotelCard";
import { CartContext } from "@/context/CartContext";

export default function ShoppingCart() {
  const { cartItems, removeFromCart } = useContext(CartContext);

  return (
    <div className="flex flex-col w-full p-4 text-black">
      <div className="flex w-full justify-center items-center border-b border-[#EEF0EB] pb-4 md:py-6 md:text-xl lg:text-2xl">
        <p>Order Details</p>
      </div>

      {cartItems.length === 0 ? (
        <p className="mt-4 text-center">Your cart is empty.</p>
      ) : (
        <div className="mt-4">
          {cartItems.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="flex flex-col mb-4 border-b pb-4"
            >
              {item.type === "flight" && item.flight && (
                <>
                  <FlightDetails
                    flight={item.flight.flightData}
                    carriers={item.flight.carriers}
                    aircraft={item.flight.aircraft}
                  />
                  <button
                    className="mt-2 rounded-lg bg-red-500 text-white p-2"
                    onClick={() => removeFromCart(item.id, "flight")}
                  >
                    Remove Flight
                  </button>
                </>
              )}
              {item.type === "hotel" && item.hotel && (
                <>
                  <HotelCard
                    offer={item.hotel.offer}
                    image={item.hotel.image}
                    rating={item.hotel.rating}
                    streetAddress={item.hotel.streetAddress}
                    featured={item.hotel.featured}
                  />
                  <button
                    className="mt-2 rounded-lg bg-red-500 text-white p-2"
                    onClick={() => removeFromCart(item.id, "hotel")}
                  >
                    Remove Hotel
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
