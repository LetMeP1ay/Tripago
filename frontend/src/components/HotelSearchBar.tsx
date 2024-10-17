"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface HotelSuggestion {
  id: number;
  name: string;
  iataCode: string;
  subType: string;
  relevance: number;
  type: string;
  hotelIds: string[];
  address: {
    cityName: string;
    countryCode: string;
  };
  geoCode: {
    latitude: number;
    longitude: number;
  };
}

interface HotelSearchBarProps {
  countryCode: string;
  onHotelSelect: (hotelId: string[]) => void;
}

const HotelSearchBar: React.FC<HotelSearchBarProps> = ({
  countryCode,
  onHotelSelect,
}) => {
  const [keyword, setKeyword] = useState("");
  const [suggestions, setSuggestions] = useState<HotelSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (keyword.length > 2) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword]);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/hotel-suggestions?keyword=${keyword}&countryCode=${countryCode}`
      );
      const data = await response.json();
      setSuggestions(data || []);
    } catch (error) {
      console.error("Error fetching hotel suggestions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      <div className="w-full h-10 bg-[#ebebeb] rounded-[50px] flex items-center gap-2.5 p-2.5">
        <Image
          alt="icon"
          src="/Search.svg"
          height={20}
          width={20}
          className="h-4 w-4 md:h-5 md:w-5"
        />
        <input
          placeholder="Search hotel"
          className="bg-[#ebebeb] outline-none w-full md:text-xl"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          disabled={!countryCode}
        />
      </div>
      {isLoading && (
        <div className="absolute w-full bg-white shadow-md rounded-md mt-1 z-10 p-2">
          <p>Loading...</p>
        </div>
      )}
      {suggestions.length > 0 && !isLoading && (
        <ul className="absolute w-full bg-white shadow-md rounded-md mt-1 z-10 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                if (suggestion.hotelIds && suggestion.hotelIds.length > 0) {
                  onHotelSelect(suggestion.hotelIds);
                } else {
                  console.warn("No hotelIds available for this suggestion");
                }
              }}
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HotelSearchBar;
