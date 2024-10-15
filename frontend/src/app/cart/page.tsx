"use client";

import { useContext, useEffect, useMemo, useState } from "react";
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
  const [displayStripe, setDisplayStripe] = useState<boolean>(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const totalPrice = useMemo(() => {
    let total = 0;
    cartItems.forEach((item) => {
      if (item.type === "flight" && item.flight) {
        const price = parseFloat(item.flight.flightData.price.total);
        if (!isNaN(price)) {
          total += price;
        }
      } else if (item.type === "hotel" && item.hotel) {
        if (
          item.hotel.offer.offers &&
          item.hotel.offer.offers.length > 0 &&
          item.hotel.offer.offers[0].price &&
          item.hotel.offer.offers[0].price.total
        ) {
          const price = parseFloat(item.hotel.offer.offers[0].price.total);
          if (!isNaN(price)) {
            total += price;
          }
        }
      }
    });
    return total.toFixed(2);
  }, [cartItems]);

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
      {cartItems.length > 0 && (
        <>
          <div className="flex w-full justify-center items-center text-center py-4 mt-8 mb-8 bg-[#FDE6EB] text-[#EE3D60]">
            <Image
              alt="icon"
              src="/Timer.svg"
              height={20}
              width={20}
              className="w-6 h-6"
            />
            <p className="pl-4 font-light">
              The remaining time of order:{" "}
              <b className="font-bold">{formatTime(timeLeft)}</b>
            </p>
          </div>
          <p className="font-medium md:px-20 md:text-3xl">Your Trip</p>
        </>
      )}
      {cartItems.length === 0 ? (
        <p className="mt-96 text-center text-3xl">Your cart is empty.</p>
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

          {cartItems.length > 0 && (
            <div className="flex justify-between items-center mb-20 pt-6 md:px-20 w-full border-t md:text-xl">
              <p className="text-[#1C6AE4] font-bold">
                ${totalPrice}{" "}
                <p className="text-[#8C8D89] font-light">Total Price</p>
              </p>
              <button onClick={() => router.push("/checkout")} className="bg-[#1C6AE4] hover:bg-[#0B54FF] active:bg-[#0A32FF] p-4 text-white rounded-sm font-medium transition-all duration-600 ease-in-out">
                Proceed to Payment
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}