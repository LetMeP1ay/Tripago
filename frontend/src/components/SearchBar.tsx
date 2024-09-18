"use client";
import React, { useState, useEffect, useRef } from "react";
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
  type: "text" | "date" | "count" | "dropdown";
  value?: any;
  onChange?: (value: any) => void;
  label?: string;
}

const toTitleCase = (text: string) => {
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function SearchBar({
  label = "From",
  type = "text",
  value = "",
  onChange,
}: SearchBarProps) {
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
      if (!selectedAirport && value) {
        fetchAirportData(value);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [value, selectedAirport]);

  const handleSelect = (airport: Airport) => {
    setSelectedAirport(airport);
    setIsEditable(false);
    onChange && onChange(airport.iataCode);
    setSuggestions([]);
  };

  const handleInputClick = () => {
    setIsEditable(true);
    setSelectedAirport(null);
  };

  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleDateClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  switch (type) {
    case "date":
      return (
        <div>
          <div className="flex w-full font-inter bg-white text-black">
            <label
              className="absolute mt-[-8px] ml-6 text-center bg-white text-[#757272] text-xs"
              style={{ width: `${label.length * 1.5}ch` }}
            >
              {label}
            </label>

            <Image
              src={`Departure.svg`}
              alt="Timer"
              width={32.26}
              height={17}
              className="absolute mt-5 ml-7 cursor-pointer"
              onClick={handleDateClick}
            />

            <input
              type="date"
              ref={dateInputRef}
              value={value}
              onChange={(e) => onChange && onChange(e.target.value)}
              className="appearance-none w-full h-14 pl-14 text-xs border border-[#E9EBEA] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>
        </div>
      );
    case "count":
      return (
        <div>
          <div className="flex w-full font-inter bg-white text-black">
            <label
              className="absolute mt-[-8px] ml-6 text-center bg-white text-[#757272] text-xs"
              style={{ width: `${label.length * 1.5}ch` }}
            >
              {label}
            </label>

            <input
              type="number"
              min={1}
              max={100}
              value={value}
              onChange={(e) => {
                const inputValue = Math.max(
                  1,
                  Math.min(100, Number(e.target.value))
                );
                onChange && onChange(inputValue);
              }}
              className="w-full h-14 pl-6 text-xs border border-[#E9EBEA] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
            <span
              className="absolute text-xs mt-[20.5px]"
              style={{ marginLeft: `${value.toString().length + 6 * 0.6}ch` }}
            >
              {value == 1 ? "Adult" : "Adults"}
            </span>
          </div>
        </div>
      );
    case "dropdown":
      return (
        <div className="relative w-full font-inter bg-white text-black">
          <label
            className="absolute mt-[-8px] ml-6 text-center bg-white text-[#757272] text-xs"
            style={{ width: `${label.length * 1.5}ch` }}
          >
            {label}
          </label>

          <select
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            className="appearance-none w-full h-14 pl-6 text-xs border border-[#E9EBEA] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="1">Economy</option>
            <option value="2">Premium Economy</option>
            <option value="3">Business</option>
            <option value="4">First</option>
          </select>
        </div>
      );

    default:
      return (
        <div className="flex w-full font-inter bg-white text-black">
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
              className="w-full h-14 pt-1 pl-14 text-lg border border-[#E9EBEA] rounded-lg flex flex-col cursor-pointer"
              onClick={handleInputClick}
            >
              <div>
                <span className="text-black text-sm">
                  {toTitleCase(selectedAirport.address.cityName)}
                </span>
                <span className="text-[#757575] text-[11px] ml-3 leading-none">
                  {selectedAirport.iataCode}
                </span>
              </div>
              <div className="text-[#C2BDBD] text-[10px] font-medium leading-none">
                <span>{toTitleCase(selectedAirport.name)},</span>
                <span className="ml-1">
                  {toTitleCase(selectedAirport.address.countryName)}
                </span>
              </div>
            </div>
          ) : (
            <input
              type="text"
              value={value}
              placeholder="City or Airport"
              onChange={(e) => onChange && onChange(e.target.value)}
              onClick={handleInputClick}
              className="w-full h-14 pl-14 text-sm border border-[#E9EBEA] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          )}

          {suggestions.length > 0 && (
            <ul className="absolute z-50 w-[279px] h-fit mt-[56px] bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-scroll">
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
}
