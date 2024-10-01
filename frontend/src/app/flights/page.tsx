"use client";

import { useState } from "react";
import axios from "axios";
import SearchBar from "@/components/SearchBar";
import FlightDetails from "@/components/FlightDetails";
import { useRouter } from "next/navigation";

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
  const [flightClass, setFlightClass] = useState<FlightClass>(
    FlightClass.Economy
  );
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const router = useRouter();

  const formatDuration = (duration: string) => {
    const hoursMatch = duration.match(/(\d+)H/);
    const minutesMatch = duration.match(/(\d+)M/);

    const hours = Number(hoursMatch ? hoursMatch[1] : 0);
    const minutes = Number(minutesMatch ? minutesMatch[1] : 0);

    return Number(hours * 60 + minutes);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const queryParams: Record<string, any> = {
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      adults,
      travelClass: flightClass,
    };

    if (tripType === TripType.RoundTrip && returnDate) {
      queryParams.returnDate = returnDate;
    }

    const endpoint = `${process.env.NEXT_PUBLIC_API_URL}/api/flights`;

    try {
      const response = await axios.get(endpoint, { params: queryParams });
      setResults(response.data);
      setLoading(false);
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

  const sortedResults = results?.data
    ? [...results.data].sort((a, b) => {
        if (sortBy === "price") {
          return parseFloat(a.price.total) - parseFloat(b.price.total);
        } else if (sortBy === "departure") {
          return (
            new Date(a.itineraries[0].segments[0].departure.at).getTime() -
            new Date(b.itineraries[0].segments[0].departure.at).getTime()
          );
        } else if (sortBy === "duration") {
          return (
            formatDuration(a.itineraries[0].duration) -
            formatDuration(b.itineraries[0].duration)
          );
        }
        return 0;
      })
    : [];

  return (
    <div
      className={`flex flex-col bg-white p-4 text-black items-center justify-center font-inter ${
        results ? "h-auto w-auto" : "h-full w-full"
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
      </form>

      {loading && <p>Looking for tickets...</p>}

      {results && (
        <div className="w-full lg:w-auto p-4 flex flex-col items-end justify-center">
          <div className="flex justify-end mb-4">
            <select
              className="border p-2 rounded"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="price">Price</option>
              <option value="departure">Earliest Departure</option>
              <option value="duration">Duration</option>
            </select>
          </div>

          {sortedResults?.map((flight: any) => (
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
