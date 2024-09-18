"use client";

import React, { useEffect, useState } from "react";
import { useStripe, useElements, PaymentElement, } from "@stripe/react-stripe-js";
import convertToSubcurrency from "@/../lib/convertToSubcurrency";

const CheckoutPage = ({amount}: { amount: number }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState<string>();
    const [clientSecret, setClientSecret] =useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
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
      );
}

export default CheckoutPage;


