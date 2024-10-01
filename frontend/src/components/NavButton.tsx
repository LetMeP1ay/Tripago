"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface NavButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export default function NavButton({
  label,
  isActive,
  onClick,
}: NavButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/${label.toLowerCase()}`);
    onClick();
  };

  const iconSrc = isActive
    ? `/${label.toLowerCase()}Active.svg`
    : `/${label.toLowerCase()}.svg`;

  return (
    <button
      className={
        `w-full flex items-center justify-center rounded-lg p-3.5 font-medium transition-all duration-600 ease-in-out ` +
        (isActive ? `text-white bg-[#71D1FC] hover:bg-[#5BBEEB] active:bg-[#5AAEEA]` : `text-[#727272] bg-[#DADADA] hover:bg-[#CCCCCC] active:bg-[#BBB]`)
      }
      onClick={handleClick}
    >
      <Image
        alt={`${label} Icon`}
        src={iconSrc}
        width={0}
        height={0}
        className="w-6 md:w-8"
      />
      <p className="pl-4">{label}</p>
    </button>
  );
}
