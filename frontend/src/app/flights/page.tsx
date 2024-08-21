"use client";

import { useState } from "react";

export default function FlightSearch() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchFlights = async (
    origin: string,
    destination: string,
    departureDate: string
  ) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/flights?origin=${origin}&destination=${destination}&departureDate=${departureDate}`
      );
      const data = await res.json();
      setFlights(data.data);
    } catch (err) {
      setError("We had a problem with fetching your flights... sorry!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Search Flights</h1>
      <button onClick={() => searchFlights("NYC", "LAX", "2024-09-10")}>
        Search
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {flights.map((flight: any) => (
          <li key={flight.id}>
            {flight.itineraries[0].segments[0].departure.iataCode} to{" "}
            {flight.itineraries[0].segments[0].arrival.iataCode} - $
            {flight.price.total}
          </li>
        ))}
      </ul>
    </div>
  );
}
