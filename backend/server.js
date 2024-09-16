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
    const { origin, destination, departureDate } = req.query;

    const response = await amadeusApiV2.get("/shopping/flight-offers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate,
        adults: "1",
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch flight offers" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
