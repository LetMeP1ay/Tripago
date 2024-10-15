"use client";

import React, { useState } from "react";
import convertToSubcurrency from "@/../lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "@/components/CheckoutPage";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function Stripe() {
  const amount = 750;
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
              <span className="text-2xl font-bold">${amount}</span>
            </div>
          </div>

          {/* Animated dropdown */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showDetails ? "max-h-96" : "max-h-0"
            }`}
          >
            <div className="bg-white text-black mt-5 p-5 rounded-lg">
              <h3 className="text-2xl font-bold mb-3">Order Details</h3>
              <ul className="list-disc list-inside">
                <li>Plane Ticket - Auckland to Sydney - $300</li>
                <li>Hotel Booking - 3 Nights in Sydney - $450</li>
              </ul>
            </div>
          </div>
        </div>

        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(amount),
            currency: "nzd",
          }}
        >
          <CheckoutPage amount={amount} />
        </Elements>
      </div>
    </div>
  );
}
