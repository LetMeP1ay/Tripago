"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import NavButton from "@/components/NavButton";
import NotificationBell from "@/components/NotificationBell";

function useWindowWidth() {
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowWidth;
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const windowWidth = useWindowWidth();
  const isDesktop = windowWidth >= 768;

  const [activeButton, setActiveButton] = useState<string>("");
  const [screenLoaded, setScreenLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (pathname.includes("/flights")) {
      setActiveButton("Flights");
    } else if (pathname.includes("/food")) {
      setActiveButton("Food");
    } else if (pathname.includes("/hotels")) {
      setActiveButton("Hotels");
    } else if (pathname.includes("/signup")) {
      setActiveButton("Signup");
    } else if (pathname.includes("/cart")) {
      setActiveButton("Cart");
    } else if (pathname.includes("/login")) {
      setActiveButton("Login");
    } else if (pathname.includes("/")) {
      setActiveButton("Map");
    } else {
      setActiveButton("");
    }
  }, [pathname]);

  useEffect(() => {
    if (screenLoaded) {
      document.body.classList.remove("overflow-hidden");
    }
  }, [screenLoaded]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setScreenLoaded(true);
    }, 800);

    return () => clearTimeout(timeout);
  }, []);

  if (pathname.includes("/login") || pathname.includes("/signup")) {
    return "";
  }
  if (screenLoaded) {
    return (
      <header className="w-full md:bg-[#474646]">
        <nav className="p-4 flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="flex justify-between items-center w-full md:w-auto">
            <Image
              src="/Tripago.svg"
              alt="Tripago Logo"
              width={0}
              height={0}
              className="w-24 hover:cursor-pointer"
              onClick={() => router.push("/")}
            />
            {!isDesktop && <NotificationBell />}
          </div>
          {!(pathname.includes("/cart") && !isDesktop) && (
            <div className="flex justify-center items-center space-x-3 md:space-x-8 mt-8 md:mt-0 md:ml-auto md:mr-8">
              <NavButton
                type={isDesktop ? "text" : "button"}
                label="Hotels"
                isActive={activeButton === "Hotels"}
                onClick={() => router.push("/hotels")}
              />
              <NavButton
                type={isDesktop ? "text" : "button"}
                label="Flights"
                isActive={activeButton === "Flights"}
                onClick={() => router.push("/flights")}
              />
              <NavButton
                type={isDesktop ? "text" : "button"}
                label="Food"
                isActive={activeButton === "Food"}
                onClick={() => router.push("/food")}
              />
            </div>
          )}
          {isDesktop && (
            <div className="flex items-center space-x-8">
              <NavButton
                type="text"
                label="Map"
                isActive={activeButton === "Map"}
                onClick={() => router.push("/")}
              />
              <NavButton
                type="text"
                label="Cart"
                isActive={activeButton === "Cart"}
                onClick={() => router.push("/cart")}
              />
              <NavButton
                type="text"
                label="Signup"
                isActive={activeButton === "Signup"}
                onClick={() => router.push("/signup")}
              />
              <NavButton
                type="text"
                label="Login"
                isActive={activeButton === "Login"}
                onClick={() => router.push("/login")}
              />
              <NotificationBell />
            </div>
          )}
        </nav>
      </header>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-black"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
}
