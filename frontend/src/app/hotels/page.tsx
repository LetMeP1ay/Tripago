"use client";

import { useState } from "react";

export default function HotelSearch() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchHotels = async (
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
      setHotels(data.data);
    } catch (err) {
      setError("We had a problem with fetching hotels... sorry!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Search Flights</h1>
      <button onClick={() => searchHotels("NYC", "LAX", "2024-09-10")}>
        Search
      </button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {hotels.map((flight: any) => (
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
