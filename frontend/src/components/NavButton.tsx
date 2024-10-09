"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface NavButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
  type?: "button" | "text";
}

export default function NavButton({
  label,
  isActive,
  onClick,
  type,
}: NavButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/${label.toLowerCase()}`);
    onClick();
  };

  const iconSrc = isActive
    ? `/${label.toLowerCase()}Active.svg`
    : `/${label.toLowerCase()}.svg`;

  switch (type) {
    case "button":
      return (
        <button
          className={
            `w-full flex items-center justify-center rounded-lg p-3.5 font-medium transition-all duration-600 ease-in-out ` +
            (isActive
              ? `text-white bg-[#71D1FC] hover:bg-[#5BBEEB] active:bg-[#5AAEEA]`
              : `text-[#727272] bg-[#DADADA] hover:bg-[#CCCCCC] active:bg-[#BBB]`)
          }
          onClick={handleClick}
        >
          <Image
            alt={`${label} Icon`}
            src={iconSrc}
            width={0}
            height={0}
            className="w-6"
          />
          <p className="pl-4">{label}</p>
        </button>
      );
    case "text":
      return (
        <p
          className={
            `w-full font-medium text-2xl transition-all duration-600 ease-in-out cursor-pointer ` +
            (isActive
              ? `text-[#71D1FC] hover:text-[#5BBEEB] active:text-[#5AAEEA]`
              : `text-[#BBB] hover:text-[#AAA] active:text-[#A0A0A0]`)
          }
          onClick={handleClick}
        >
          {label}
        </p>
      );
  }
}
