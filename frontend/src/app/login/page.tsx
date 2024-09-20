"use client";
import { useState } from "react";
import { auth } from "../../../firebase-config";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import Image from "next/image";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const appleProvider = new OAuthProvider("apple.com");

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      alert("Sign in successful!");
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleFacebook = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      alert("Sign in successful!");
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleApple = async () => {
    try {
      await signInWithPopup(auth, appleProvider);
      alert("Sign in successful!");
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="bg-white h-screen w-screen text-black flex flex-col items-center justify-center font-inter">
      <div className="flex flex-col items-center w-[366px] pt-5 pr-6 pb-0 pl-6">
        <Image
          className="mb-3"
          src="Logo.svg"
          alt="Tripago Logo"
          width={48}
          height={48}
        />
        <h1 className="text-lg font-semibold text-gray-900">
          Log in to your account
        </h1>
        <p className="text-gray-600 text-sm text-center font-light">
          Check out more easily and access your tickets on any device
        </p>
      </div>
      <form
        onSubmit={handleLogin}
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
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-lg shadow-sm w-full px-3.5 py-2.5 mb-4"
          required
        />
        <button
          type="submit"
          className="border border-gray-300 bg-[#5CBCF1D6] text-white rounded-lg w-full shadow-sm font-semibold py-2.5"
        >
          Sign In
        </button>
      </form>
      <div className="relative flex py-5 items-center w-[366px]">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-2 text-sm text-gray-600">OR</span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>
      <div className="flex flex-col items-center justify-center w-[366px]">
        <button
          onClick={handleGoogle}
          className="flex justify-center border border-gray-300 rounded-lg w-full shadow-sm font-semibold py-2.5 mb-4"
        >
          <Image
            src="Google.svg"
            alt="Google Logo"
            width={24}
            height={24}
            className="mr-3"
          />
          Sign in with Google
        </button>

        <button
          onClick={handleFacebook}
          className="flex justify-center border border-gray-300 rounded-lg w-full shadow-sm font-semibold py-2.5 mb-4"
        >
          <Image
            src="Facebook.svg"
            alt="Facebook Logo"
            width={24}
            height={24}
            className="mr-3"
          />
          Sign in with Facebook
        </button>
        <button
          onClick={handleApple}
          className="flex justify-center border border-gray-300 rounded-lg w-full shadow-sm font-semibold py-2.5"
        >
          <Image
            src="Apple.svg"
            alt="Apple Logo"
            width={24}
            height={24}
            className="mr-3"
          />
          Sign in with Apple
        </button>
      </div>
    </div>
  );
};

export default Login;
