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
  const [activeButton, setActiveButton] = useState<string>("");

  const windowWidth = useWindowWidth();

  const isDesktop = windowWidth >= 768;

  useEffect(() => {
    if (pathname.includes("/flights")) {
      setActiveButton("Flights");
    } else if (pathname.includes("/food")) {
      setActiveButton("Food");
    } else if (pathname.includes("/hotels")) {
      setActiveButton("Hotels");
    } else {
      setActiveButton("");
    }
  }, [pathname]);

  return (
    <header className="w-full">
      <nav className="p-4 flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex justify-between items-center w-full md:w-auto">
          <Image
            src="/Tripago.svg"
            alt="Tripago Logo"
            width={0}
            height={0}
            className="w-28 md:w-40 hover:cursor-pointer"
            onClick={() => router.push("/")}
          />
          <div className="md:hidden">
            <NotificationBell />
          </div>
        </div>
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
        <div className="hidden md:flex">
          <NotificationBell />
        </div>
      </nav>
    </header>
  );
}
