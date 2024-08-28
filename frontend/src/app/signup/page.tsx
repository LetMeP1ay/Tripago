"use client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase-config";
import { useState } from "react";
import Image from "next/image";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [displayPassword, setDisplayPassword] = useState(false);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Sign up successful!");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="bg-white h-screen w-screen text-black flex flex-col items-center justify-center font-inter">
      <div className="flex flex-col items-center w-[366px] pt-5 pr-6 pb-0 pl-6">
        <Image className="mb-3" src="Logo.svg" alt="Tripago Logo" width={48} height={48} />
        <h1 className="text-lg font-semibold text-gray-900">
          Create an account
        </h1>
        <p className="text-gray-600 text-sm text-center font-light">
          Check out more easily and access your tickets on any device
        </p>
      </div>
      <form
        onSubmit={handleSignUp}
        className="flex flex-col items-center justify-center w-[366px] pt-5"
      >
        <input
          type="email"
          placeholder="Enter your email"
          className="border border-gray-300 rounded-lg shadow-sm w-full px-3.5 py-2.5 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {displayPassword && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg shadow-sm w-full px-3.5 py-2.5 mb-4"
            required
          />
        )}
        <button
          type="submit"
          onClick={() => setDisplayPassword(true)}
          className="border border-gray-300 bg-[#5CBCF1D6] text-white rounded-lg w-full shadow-sm font-semibold py-2.5"
        >
          Get Started
        </button>
      </form>
      <div className="relative flex py-5 items-center w-[366px]">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-2 text-sm text-gray-600">OR</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>
      {error && <p>{error}</p>}
    </div>
  );
};

export default SignUp;
