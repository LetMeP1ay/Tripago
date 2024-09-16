"use client";
import React, { useState, useEffect } from "react";

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

export default function SearchBar({ label = "From" }: SearchBarProps) {
  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [selectedAirport, setSelectedAirport] = useState<Airport | null>(null);

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
      fetchAirportData(query);
    }, 200);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (airport: Airport) => {
    setQuery(
      `${airport.address.cityName}, ${airport.name} (${airport.iataCode})`
    );
    setSelectedAirport(airport);
    setSuggestions([]);
  };

  return (
    <div className="flex w-full max-w-lg mx-auto font-inter bg-white">
      <label className="absolute mt-2 ml-6 text-center bg-white text-[#757272] text-xs" style={{width: `${label.length * 1.5}ch`}}>{label}</label>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-14 mt-4 px-4 py-2 text-lg border border-[#E9EBEA] rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
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
              <div className="font-semibold text-gray-700">{city}</div>
              <ul className="ml-4 border-l-2 pl-2 border-gray-300">
                {airports.map((airport) => (
                  <li
                    key={airport.id}
                    onClick={() => handleSelect(airport)}
                    className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                  >
                    {airport.name} {airport.address.countryName} (
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
