const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const amadeusAuth = axios.create({
  baseURL: "https://test.api.amadeus.com/v1",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

const amadeusApiV1 = axios.create({
  baseURL: "https://test.api.amadeus.com/v1",
});

const amadeusApiV2 = axios.create({
  baseURL: "https://test.api.amadeus.com/v2",
});

const amadeusApiV3 = axios.create({
  baseURL: "https://test.api.amadeus.com/v3",
});

const getAccessToken = async () => {
  const response = await amadeusAuth.post(
    "security/oauth2/token",
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: process.env.AMADEUS_API_KEY,
      client_secret: process.env.AMADEUS_API_SECRET,
    })
  );
  return response.data.access_token;
};

app.get("/api/airport-suggestions", async (req, res) => {
  try {
    const token = await getAccessToken();
    const { keyword } = req.query;

    const response = await amadeusApiV1.get(
      `/reference-data/locations?subType=AIRPORT,CITY&keyword=${keyword}&page%5Blimit%5D=5`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch airport suggestions" });
  }
});

app.get("/api/flights", async (req, res) => {
  try {
    const token = await getAccessToken();

    const {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      returnDate,
      adults,
      travelClass,
      currencyCode = "USD",
    } = req.query;

    const params = {
      originLocationCode,
      destinationLocationCode,
      departureDate,
      adults,
      travelClass,
      currencyCode,
    };

    if (returnDate) {
      params.returnDate = returnDate;
    }

    const response = await amadeusApiV2.get("/shopping/flight-offers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch flight offers" });
  }
});

app.get("/api/hotels", async (req, res) => {
  try {
    const token = await getAccessToken();

    const { cityCode } = req.query;

    const params = {
      cityCode,
    };

    const response = await amadeusApiV1.get(
      "reference-data/locations/hotels/by-city",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel offers" });
  }
});

app.get("/api/hotel-offers", async (req, res) => {
  try {
    const token = await getAccessToken();

    const {
      hotelIds,
      adults,
      checkInDate,
      checkOutDate,
      roomQuantity,
      priceRange,
      currency = "USD",
      includeClosed = true,
      bestRateOnly = true,
    } = req.query;

    const params = {
      hotelIds,
      adults,
      checkInDate,
      checkOutDate,
      roomQuantity,
      priceRange,
      currency,
      includeClosed,
      bestRateOnly,
    };

    const response = await amadeusApiV3.get("shopping/hotel-offers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching hotel offers:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch hotel offers" });
  }
});

app.get("/api/hotel-ratings", async (req, res) => {
  try {
    const token = await getAccessToken();

    const { hotelIds } = req.query;

    const params = {
      hotelIds,
    };

    const response = await amadeusApiV2.get("e-reputation/hotel-sentiments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching hotel ratings:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch hotel ratings" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
