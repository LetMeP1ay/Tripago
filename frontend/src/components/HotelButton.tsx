"use client";

interface HotelButtonProprs {
  label: string;
  isActive: boolean;
}

export default function HotelButton({ label, isActive }: HotelButtonProprs) {
  return (
    <button
      className={
        `w-40 md:w-full mr-4 h-8 md:h-10 md:mb-6 rounded-[50px] justify-center items-center flex p-3.5 font-medium transition-all duration-600 ease-in-out ` +
        (isActive
          ? `text-white bg-[#71D1FC] hover:bg-[#5BBEEB] active:bg-[#5AAEEA]`
          : `text-[#727272] bg-[#ebebeb]  hover:bg-[#DADADA] active:bg-[#BBB]`)
      }
    >
      <p>{label}</p>
    </button>
  );
}
