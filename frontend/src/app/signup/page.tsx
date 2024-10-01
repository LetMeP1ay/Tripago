"use client";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { auth } from "../../../firebase-config";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [displayPassword, setDisplayPassword] = useState(false);
  const [displayEmail, setDisplayEmail] = useState(true);
  const router = useRouter();

  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const appleProvider = new OAuthProvider("apple.com");

  const firebaseErrorMessages: Record<string, string> = {
    "auth/email-already-in-use": "This email is already in use.",
    "auth/weak-password": "The password must be at least 6 characters long.",
    "auth/invalid-email": "Please provide a valid email address.",
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/flights");
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push("/flights");
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleFacebook = async () => {
    try {
      await signInWithPopup(auth, facebookProvider);
      router.push("/flights");
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleApple = async () => {
    try {
      await signInWithPopup(auth, appleProvider);
      router.push("/flights");
    } catch (e: any) {
      setError(e.message);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
        {displayEmail && (
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-gray-300 rounded-lg shadow-sm w-full px-3.5 py-2.5 mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}
        {displayPassword && (
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-lg shadow-sm w-full px-3.5 py-2.5 mb-4"
            required
          />
        )}
        {displayEmail && (
          <button
            onClick={() => {
              setDisplayPassword(validateEmail(email));
              setDisplayEmail(!validateEmail(email));
            }}
            className="border border-gray-300 bg-[#5CBCF1D6] text-white rounded-lg w-full shadow-sm font-semibold py-2.5"
          >
            Get Started
          </button>
        )}
        {displayPassword && (
          <button
            type="submit"
            className="border border-gray-300 bg-[#5CBCF1D6] text-white rounded-lg w-full shadow-sm font-semibold py-2.5"
          >
            Create your account
          </button>
        )}
      </form>
      {error && (
        <p className="pt-4 text-red-500">
          {firebaseErrorMessages[error.match(/\(([^)]+)\)/)?.[1] || ""] ||
            "An unknown error occurred. Please try again."}
        </p>
      )}
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
          Sign up with Google
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
          Sign up with Facebook
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
          Sign up with Apple
        </button>
      </div>
    </div>
  );
};

export default SignUp;
