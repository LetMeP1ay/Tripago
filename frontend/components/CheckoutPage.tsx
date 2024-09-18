"use client";

import React, { useEffect, useState } from "react";
import { 
  useStripe, 
  useElements, 
  PaymentElement, 
} from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/../lib/convertToSubcurrency";

const CheckoutPage = ({amount}: { amount: number }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setErrorMessage] = useState<string>();
    const [clientSecret, setClientSecret] =useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }, 
          body: JSON.stringify({ amount: convertToSubcurrency(amount) }), 
      })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
    }, [amount]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setLoading(true);

      if (!stripe || !elements) {
        return;
      }

      const { error: submitError } = await elements.submit();

      if (submitError) {
        setErrorMessage(submitError.message);
        setLoading(false);
        return;
      }
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
        {clientSecret && <PaymentElement />}

        {errorMessage && <div>{errorMessage}</div>}

        <button
        disabled={!stripe || !loading} className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse">
        {!loading ? 'Pay $${amount}' : "Processing..."} Pay</button>
      </form>
    );
  }

  export default CheckoutPage;

    /*const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    
        if (!stripe || !elements) {
          return; // Stripe.js has not yet loaded.
        }
    
        setLoading(true);
    
        const { error } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: "your_return_url", // Update with your redirect URL after payment
          },
        });
    
        if (error) {
          setErrorMessage(error.message || "An unexpected error occurred.");
        }
    
        setLoading(false);
      };
    
      return (
        <form onSubmit={handleSubmit}>
          <PaymentElement />
          {errorMessage && <div>{errorMessage}</div>}
          <button disabled={!stripe || loading} type="submit">
            {loading ? "Processing..." : `Pay ${convertToSubcurrency(amount)} NZD`}
          </button>
        </form>
      );*/


