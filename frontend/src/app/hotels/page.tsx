"use client";

import { useState } from "react";

export default function HotelSearch() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchHotels = async (cityCode: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/hotels?cityCode=${cityCode}`
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
      <h1>Search Hotels</h1>
      <button onClick={() => searchHotels("NYC")}>Search</button>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {hotels.map((hotel: any, index: number) => (
          <li key={index}>
            {hotel.name} - {hotel.iataCode}, {hotel.address.countryCode}
          </li>
        ))}
      </ul>
    </div>
  );
}
