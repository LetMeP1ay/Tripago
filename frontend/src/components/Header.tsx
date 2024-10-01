"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import NavButton from "@/components/NavButton";
import NotificationBell from "@/components/NotificationBell";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeButton, setActiveButton] = useState<string>("");

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
    <header>
      <nav className="p-4 flex flex-col">
        <div className="flex justify-between items-center">
          <Image
            src="/Tripago.svg"
            alt="Tripago Logo"
            width={0}
            height={0}
            className="w-28 md:w-40 hover:cursor-pointer"
            onClick={() => router.push("/")}
          />
          <NotificationBell />
        </div>
        <div className="flex justify-center items-center space-x-3 md:space-x-8 mt-8">
          <NavButton
            label="Hotels"
            isActive={activeButton === "Hotels"}
            onClick={() => router.push("/hotels")}
          />
          <NavButton
            label="Flights"
            isActive={activeButton === "Flights"}
            onClick={() => router.push("/flights")}
          />
          <NavButton
            label="Food"
            isActive={activeButton === "Food"}
            onClick={() => router.push("/food")}
          />
        </div>
      </nav>
    </header>
  );
}
