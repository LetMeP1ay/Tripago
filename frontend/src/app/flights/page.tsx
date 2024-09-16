"use client";

import { useState } from "react";
import axios from "axios";

enum TripType {
  RoundTrip = "1",
  OneWay = "2",
  MultiCity = "3",
}

enum FlightClass {
  Economy = "1",
  PremiumEconomy = "2",
  Business = "3",
  First = "4",
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const queryParams: Record<string, any> = {
      departure_id: origin,
      arrival_id: destination,
      departure_date: departureDate,
      adults,
      flight_class: flightClass,
      type: tripType,
    };
    if (tripType === TripType.RoundTrip && returnDate) {
      queryParams.return_date = returnDate;
    }

    const endpoint =
      tripType === TripType.OneWay
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/flights/one-way`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/flights/round-trip`;

    try {
      const response = await axios.get(endpoint, { params: queryParams });
      setResults(response.data);
    } catch (e) {
      console.error("Error fetching flight data:", e);
    }
  };

  return (
    <div className="flex w-screen h-screen bg-white text-black">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Trip Type:</label>
          <select
            value={tripType}
            onChange={(e) => setTripType(e.target.value as TripType)}
          >
            <option value={TripType.OneWay}>One-Way</option>
            <option value={TripType.RoundTrip}>Round Trip</option>
          </select>
        </div>

        <div>
          <label>Origin Airport:</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Destination Airport:</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Departure Date:</label>
          <input
            type="date"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
            required
          />
        </div>

        {tripType === TripType.RoundTrip && (
          <div>
            <label>Return Date:</label>
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label>Adults:</label>
          <input
            type="number"
            value={adults}
            onChange={(e) => setAdults(Number(e.target.value))}
            min="1"
            required
          />
        </div>

        <div>
          <label>Class:</label>
          <select
            value={flightClass}
            onChange={(e) => setFlightClass(e.target.value as FlightClass)}
          >
            <option value={FlightClass.Economy}>Economy</option>
            <option value={FlightClass.PremiumEconomy}>Premium Economy</option>
            <option value={FlightClass.Business}>Business</option>
            <option value={FlightClass.First}>First</option>
          </select>
        </div>

        <button type="submit">Search Flights</button>
      </form>

      {results && (
        <div>
          <h2>Flight Results:</h2>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
