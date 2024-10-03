"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import SearchBar from "@/components/SearchBar";
import FlightDetails from "@/components/FlightDetails";
import { useRouter } from "next/navigation";
import {getUserHomeCurrency} from "../../services/currencyConversion";
import {getUserCurrencyConversion} from "../../services/currencyConversion";
import CurrencyDropdown from "@/components/CurrencyDropdown";

enum TripType {
  RoundTrip = "1",
  OneWay = "2",
  MultiCity = "3",
}

enum FlightClass {
  Economy = "ECONOMY",
  PremiumEconomy = "PREMIUM_ECONOMY",
  Business = "BUSINESS",
  First = "FIRST",
}

export default function FlightSearch() {
  const [tripType, setTripType] = useState<TripType>(TripType.OneWay);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [currencyCode, setCurrencyCode] = useState<string>("NZD");
  const [flightClass, setFlightClass] = useState<FlightClass>(
    FlightClass.Economy
  );
  const [results, setResults] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getCurrency = async () => {
      try {
        const homeCurrency = await getUserHomeCurrency();
        setCurrencyCode(homeCurrency);
      } catch(e) {
        console.error("Failed to fetch home currency", e);
      }
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const queryParams: Record<string, any> = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      adults,
      travelClass: flightClass,
      currencyCode,
    };

    if (tripType === TripType.RoundTrip && returnDate) {
      queryParams.returnDate = returnDate;
    }

    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/flights`;

    try {
      const response = await axios.get(endpoint, { params: queryParams });
      setResults(response.data);
    } catch (e) {
      console.error("Error fetching flight data:", e);
    }
  };

  const handleSelectTicket = (iataCode: string, arrivalDate: string) => {
    const queryParams: Record<string, string> = {
      cityCode: iataCode,
      checkInDate: arrivalDate.split("T")[0],
      adults: adults.toString(),
    };

    if (returnDate) {
      queryParams.checkOutDate = returnDate;
    }

    const queryString = new URLSearchParams(queryParams).toString();
    router.push(`/hotels?${queryString}`);
  };

  return (
    <div
      className={`flex flex-col bg-white p-4 text-black items-center justify-center font-inter ${
        results ? "h-auto w-auto" : "h-screen w-screen"
      }`}
    >
      <div className="flex justify-between shadow-lg rounded-[32px] w-full md:w-96 mb-14">
        <button
          onClick={() => setTripType(TripType.OneWay)}
          className={`w-full px-4 py-1.5 rounded-[60px] transition-all duration-600 ease-in-out hover:bg-[#71D1FC] hover:text-[#FDE3DD] active:bg-[#5BBEEB] ${
            tripType === TripType.OneWay
              ? "bg-[#71D1FC] text-[#FDE3DD] shadow-lg"
              : "text-[#B8B8B8]"
          }`}
        >
          One way
        </button>
        <button
          onClick={() => setTripType(TripType.RoundTrip)}
          className={`w-full px-4 py-1.5 rounded-[60px] transition-all duration-300 ease-in-out hover:bg-[#71D1FC] hover:text-[#FDE3DD] active:bg-[#5BBEEB] ${
            tripType === TripType.RoundTrip
              ? "bg-[#71D1FC] text-[#FDE3DD] shadow-lg"
              : "text-[#B8B8B8]"
          }`}
        >
          Return
        </button>
        <button
          onClick={() => setTripType(TripType.MultiCity)}
          className={`w-full px-4 py-1.5 rounded-[60px] transition-all duration-300 ease-in-out hover:bg-[#71D1FC] hover:text-[#FDE3DD] active:bg-[#5BBEEB] ${
            tripType === TripType.MultiCity
              ? "bg-[#71D1FC] text-[#FDE3DD] shadow-lg"
              : "text-[#B8B8B8]"
          }`}
        >
          Multi-City
        </button>
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-80 rounded-xl shadow-2xl pt-8 pb-8 p-4 mb-16"
      >
        <div className="pb-[31px]">
          <SearchBar
            type="text"
            value={origin}
            onChange={(value) => setOrigin(value)}
          />
        </div>

        <div className="pb-[31px]">
          <SearchBar
            type="text"
            label="To"
            value={destination}
            onChange={(value) => setDestination(value)}
          />
        </div>

        <div className="pb-[31px]">
          <SearchBar
            type="date"
            label="Departure"
            value={departureDate}
            onChange={(value) => setDepartureDate(value)}
          />
        </div>

        {tripType === TripType.RoundTrip && (
          <div className="pb-[31px]">
            <SearchBar
              type="date"
              label="Return"
              value={returnDate}
              onChange={(value) => setReturnDate(value)}
            />
          </div>
        )}

        <div className="flex flex-row">
          <div className="w-full mr-[4.5px]">
            <SearchBar
              type="count"
              label="Traveler"
              value={adults}
              onChange={(value) => setAdults(Number(value))}
            />
          </div>

          <div className="w-full ml-[4.5px] pb-[31px]">
            <SearchBar
              type="dropdown"
              label="Class"
              value={flightClass}
              onChange={(value) => setFlightClass(value)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-lg bg-[#71D1FC] text-white text-sm font-medium py-2.5 transition-all duration-600 ease-in-out hover:bg-[#5BBEEB] active:bg-[#4DAED3]"
        >
          Search
        </button>
        <CurrencyDropdown selectedCurrency={currencyCode} onCurrencyChange={setCurrencyCode}/>
      </form>

      {results && (
        <div className="w-full lg:w-auto p-4 flex flex-col items-center justify-center">
          {results?.data?.map((flight: any) => (
            <div key={flight.id} className="w-full flex flex-col items-center">
              <FlightDetails
                flight={flight}
                carriers={results.dictionaries.carriers}
                aircraft={results.dictionaries.aircraft}
              />
              <button
                className="rounded-lg bg-[#71D1FC] mb-8 w-full lg:w-1/6 p-3 text-sm font-medium text-white transition-all duration-600 ease-in-out hover:bg-[#5BBEEB] active:bg-[#4DAED3] ml-auto"
                onClick={() =>
                  handleSelectTicket(
                    flight.itineraries[0].segments[
                      flight.itineraries[0].segments.length - 1
                    ].arrival.iataCode,
                    flight.itineraries[0].segments[
                      flight.itineraries[0].segments.length - 1
                    ].arrival.at
                  )
                }
              >
                Select
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
