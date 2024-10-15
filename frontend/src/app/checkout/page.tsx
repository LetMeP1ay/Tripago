"use client";

import React, { useState, useMemo, useContext } from "react";
import convertToSubcurrency from "@/../lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "@/components/CheckoutPage";
import { CartContext } from "@/context/CartContext";
import FlightDetails from "@/components/FlightDetails";
import HotelCard from "@/components/HotelCard";
import AirlineLogo from "@/components/AirlineLogo";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Stripe() {
  const toTitleCase = (text: string) => {
    return text
      ?.toLowerCase()
      ?.split(" ")
      ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      ?.join(" ");
  };
  const { cartItems } = useContext(CartContext);
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
  }, []);
  const finalPrice = Number(totalPrice);
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div>
      <div className="text-center text-black text-4xl font-bold p-5">
        Payment
      </div>
      <div className="max-w-6xl mx-auto p-10 text-white border m-10 rounded-md bg-blue-500">
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold mb-2 text-center">Tripago</h1>
          <div className="flex justify-between items-center">
            <button className="text-white text-2xl" onClick={toggleDetails}>
              View Details
            </button>
            <div>
              <span className="text-2xl">Total: </span>
              <span className="text-2xl font-bold">${totalPrice}</span>
            </div>
          </div>
          <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showDetails ? 'overflow-y-scroll max-h-96' : 'max-h-0'}`}>
            <div className="bg-white text-black mt-5 p-5 rounded-lg">
              <h3 className="text-2xl font-bold mb-3 text-center border-b mb-6 pb-6">Order Details</h3>
              <div className="list-disc list-inside">
                {cartItems
                  .filter((item) => item.type === "flight")
                  .map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="flex flex-col mb-4 pb-4 md:px-20 text-xl">
                      <li className="flex w-full justify-between">
                        <div className="flex items-center justify-center">
                        <AirlineLogo airlineName={item.flight!.carriers[item.flight!.flightData.itineraries[0].segments[0].carrierCode]}/>
                        <span className="ml-8">{toTitleCase(item.flight!.carriers[item.flight!.flightData.itineraries[0].segments[0].carrierCode])} </span>
                        </div>
                        <span>${item.flight!.flightData.price.total}</span>
                      </li>
                    </div>
                  ))}
                {cartItems
                  .filter((item) => item.type === "hotel")
                  .map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      className="flex flex-col mb-4 border-t pt-4 w-full md:px-20">
                        
                      <li className="flex justify-between w-full pb-8 text-xl">
                        <span>{toTitleCase(item.hotel!.offer.hotel.name)} (Nights: 1)</span>
                        <span>${item.hotel!.offer.offers[0].price.total}</span>
                      </li>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(finalPrice),
            currency: "nzd",
          }}
        >
          <CheckoutPage amount={finalPrice} />
        </Elements>
      </div>
    </div>
  );
}
