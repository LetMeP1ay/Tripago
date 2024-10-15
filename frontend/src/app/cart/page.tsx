"use client";

import { useContext, useEffect, useState } from "react";
import FlightDetails from "@/components/FlightDetails";
import HotelCard from "@/components/HotelCard";
import { CartContext } from "@/context/CartContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaTimes } from "react-icons/fa";

export default function ShoppingCart() {
  const { cartItems, removeFromCart } = useContext(CartContext);
  const [timeLeft, setTimeLeft] = useState(600);
  const router = useRouter();

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  useEffect(() => {
    setTimeLeft(600);
    localStorage.setItem("cartTimeLeft", "600");
  }, [cartItems]);

  useEffect(() => {
    const savedTime = localStorage.getItem("cartTimeLeft");
    if (savedTime) {
      setTimeLeft(Number(savedTime));
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          localStorage.removeItem("cartTimeLeft");
          window.location.reload();
          return 0;
        } else {
          const newTime = prevTime - 1;
          localStorage.setItem("cartTimeLeft", newTime.toString());
          return newTime;
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col w-full h-full p-4 text-black">
      <div className="flex w-full justify-between items-center border-b border-[#EEF0EB] pb-4 md:py-6 md:text-xl lg:text-2xl">
        <Image
          alt="icon"
          src="/BackArrow.svg"
          height={20}
          width={20}
          className="w-6 h-6 cursor-pointer"
          onClick={() => router.push("/flights")}
        />
        <p className="font-medium">Order Details</p>
        <p></p>
      </div>
      <div className="flex w-full justify-center items-center text-center py-4 mt-8 mb-8 bg-[#FDE6EB] text-[#EE3D60]">
        <Image
          alt="icon"
          src="/Timer.svg"
          height={20}
          width={20}
          className="w-6 h-6"
        />
        <p className="pl-4">
          The remaining time of order: <b>{formatTime(timeLeft)}</b>
        </p>
      </div>
      <p className="font-medium md:px-20 md:text-3xl">Your Trip</p>
      {cartItems.length === 0 ? (
        <p className="mt-4 text-center">Your cart is empty.</p>
      ) : (
        <div className="mt-4">
          {cartItems
            .filter((item) => item.type === "flight")
            .map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="flex flex-col mb-4 pb-4 justify-center items-center md:px-20"
              >
                <div className="flex w-full justify-end">
                  <FaTimes
                    size={0}
                    className="absolute w-8 h-8 mt-2 mr-2 transition-all duration-600 ease-in-out hover:text-red-500 active:text-red-800 cursor-pointer"
                    onClick={() => removeFromCart(item.id, "flight")}
                  />
                </div>
                <FlightDetails
                  flight={item.flight!.flightData}
                  carriers={item.flight!.carriers}
                  aircraft={item.flight!.aircraft}
                />
              </div>
            ))}

          {cartItems
            .filter((item) => item.type === "hotel")
            .map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="flex flex-col mb-4 border-t pt-4 justify-center items-center md:px-20"
              >
                <div className="flex w-full justify-end">
                  <FaTimes
                    size={0}
                    className="w-8 h-8 mr-2 transition-all duration-600 ease-in-out hover:text-red-500 active:text-red-800 cursor-pointer"
                    onClick={() => removeFromCart(item.id, "hotel")}
                  />
                </div>
                <div className="w-full pb-8">
                  <HotelCard
                    offer={item.hotel!.offer}
                    image={item.hotel!.image}
                    rating={item.hotel!.rating}
                    streetAddress={item.hotel!.streetAddress}
                    featured={item.hotel!.featured}
                  />
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
