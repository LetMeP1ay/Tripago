"use client"

import React, { useState } from "react";
import axios from "axios";

const HotelSearch = () => {
  const [cityCode, setCityCode] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/hotels`, {
        params: {
          cityCode,
        },
      });

      setResponseData(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch hotel offers.");
      setResponseData(null);
    }
  };

  return (
    <div>
      <h1>Search Hotels</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter City Code (e.g., PAR for Paris):
          <input
            type="text"
            value={cityCode}
            onChange={(e) => setCityCode(e.target.value)}
            required
          />
        </label>
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {responseData && (
        <div>
          <h2>Raw JSON Response</h2>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default HotelSearch;
