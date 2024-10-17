"use client";

import React, { useState, useContext, useEffect } from "react";
import Image from "next/image";

export default function PaymentSuccess({
  searchParams: { amount },
}: {
  searchParams: { amount: string };
}) {
  const [currentDate, setCurrentDate] = useState(getDate());
  const [currentTime, setCurrentTime] = useState(getTime());

  return (
    <div>
      <div className="text-black text-center p-5 text-4xl font-bold">
        Payment Status
      </div>
      <div className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-blue-500">
        <h1 className="text-4xl font-extrabold mb-2">Thank you!</h1>
        <div className="flex justify-center items-center">
          <Image
            src="/ic-success.svg"
            alt="Success Tick"
            width={200}
            height={200}
          />
        </div>
        <h2 className="text-2xl font-bold mb-2">Payment Success</h2>
        <p className="text-xl font-bold mb-2">
          {currentDate} at {currentTime}
        </p>
        <div className="bg-white p-2 rounded-md text-black mt-5 text-4xl font-bold">
          ${amount}
        </div>
        <button
          onClick={() => {
            window.location.href = url;
          }}
          className="text-white w-full p-5 bg-black mt-2 rounded-md font-bold disabled:opacity-50 disabled:animate-pulse"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}

const url = `http://localhost:3000`;

function getDate() {
  const today = new Date();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const date = today.getDate();
  return `${date}/${month}/${year}`;
}

function getTime() {
  const time = new Date();
  const hours = time.getHours();
  const minutes = time.getMinutes();
  return `${hours}:${minutes < 10 ? "0" + minutes : minutes}`;
}
