"use client";

import { auth } from "firebase-config";
import { signOut } from "firebase/auth";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();
  const [activeButton, setActiveButton] = useState<string>("");

  useEffect(() => {
    if (pathname.includes("/flights")) {
      setActiveButton("Flights");
    } else if (pathname.includes("/food")) {
      setActiveButton("Food");
    } else {
      setActiveButton("Hotels");
    }
  }, [pathname]);

  if (pathname.includes("/login") || pathname.includes("/signup")) {
    return "";
  }

  return (
    <footer>
      <div className="fixed bottom-0 left-0 w-full p-4 px-8 flex justify-between items-center bg-white border-t-2 md:hidden">
        <Image
          src={"Map.svg"}
          alt="icon"
          height={0}
          width={0}
          className="w-6 h-6 md:w-8 md:h-8 hover:cursor-pointer"
          onClick={() => router.push("/")}
        />
        <Image
          src={"Cart.svg"}
          alt="icon"
          height={0}
          width={0}
          className="w-6 h-6 md:w-8 md:h-8 hover:cursor-pointer"
          onClick={() => router.push("/cart")}
        />
        <Image
          src={"Ticket.svg"}
          alt="icon"
          height={0}
          width={0}
          className="w-6 h-6 md:w-8 md:h-8 hover:cursor-pointer"
          onClick={() => router.push("/flights")}
        />
        <Image
          src={"User.svg"}
          alt="icon"
          height={0}
          width={0}
          className="w-6 h-6 md:w-8 md:h-8 hover:cursor-pointer"
          onClick={() => router.push("/signup")}
        />
        <Image
          src={"Logout.svg"}
          alt="icon"
          height={0}
          width={0}
          className="w-6 h-6 md:w-8 md:h-8 hover:cursor-pointer"
          onClick={async () => {
            router.push("/");
            await signOut(auth);
          }}
        />
      </div>
    </footer>
  );
}
