"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface Airport {
  id: string;
  iataCode: string;
  name: string;
  address: {
    cityName: string;
    countryName: string;
  };
}

interface SearchBarProps {
  label?: string;
}

const toTitleCase = (text: string) => {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function SearchBar({ label = "From" }: SearchBarProps) {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  const fetchAirportData = async (searchText: string) => {
    if (!searchText) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/airport-suggestions?keyword=${searchText}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching airport suggestions:", error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!selectedAirport) fetchAirportData(query);
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [query, selectedAirport]);

  const handleSelect = (airport: Airport) => {
    setSelectedAirport(airport);
    setQuery("");
    setIsEditable(false);
    setSuggestions([]);
  };

  const handleInputClick = () => {
    setIsEditable(true);
    if (selectedAirport) {
      setQuery(
        `${toTitleCase(selectedAirport.address.cityName)} (${
          selectedAirport.iataCode
        })`
      );
    }
    setSelectedAirport(null);
  };

  return (
    <div className="flex w-full w-screen font-inter bg-white text-black">
      <label
        className="absolute mt-[-8px] ml-6 text-center bg-white text-[#757272] text-xs"
        style={{ width: `${label.length * 1.5}ch` }}
      >
        {label}
      </label>

      <Image
        src={`${label}.svg`}
        alt="Airplane"
        width={17}
        height={17}
        className="absolute mt-5 ml-7"
      />
      {selectedAirport && !isEditable ? (
        <div
          className="w-full h-14 pl-14 text-lg border border-[#E9EBEA] rounded-lg flex flex-col cursor-pointer"
          onClick={handleInputClick}
        >
          <div>
            <span className="text-black text-sm">
              {toTitleCase(selectedAirport.address.cityName)}
            </span>
            <span className="text-[#757575] text-xs ml-3">
              {selectedAirport.iataCode}
            </span>
          </div>
          <div className="text-[#C2BDBD] text-xs font-medium">
            <span>{toTitleCase(selectedAirport.name)},</span>
            <span className="ml-1">
              {toTitleCase(selectedAirport.address.countryName)}
            </span>
          </div>
        </div>
      ) : (
        <input
          type="text"
          value={query}
          placeholder="City or Airport"
          onChange={(e) => setQuery(e.target.value)}
          onClick={handleInputClick}
          className="w-full h-14 pl-14 text-sm border border-[#E9EBEA] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      )}

      {suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-[70px] bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {Object.entries(
            suggestions.reduce(
              (grouped: Record<string, Airport[]>, airport: Airport) => {
                const city = airport.address.cityName;
                if (!grouped[city]) grouped[city] = [];
                grouped[city].push(airport);
                return grouped;
              },
              {}
            )
          ).map(([city, airports]) => (
            <li key={city} className="px-4 py-2">
              <div className="font-semibold text-gray-700">
                {toTitleCase(city)}
              </div>
              <ul className="ml-4 border-l-2 pl-2 border-gray-300">
                {airports.map((airport) => (
                  <li
                    key={airport.id}
                    onClick={() => handleSelect(airport)}
                    className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                  >
                    {toTitleCase(airport.name)}{" "}
                    {toTitleCase(airport.address.countryName)} (
                    {airport.iataCode})
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
