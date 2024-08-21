const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT;

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

const amadeusApi = axios.create({
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

app.get("/api/flights", async (req, res) => {
  try {
    const token = await getAccessToken();
    const { origin, destination, departureDate } = req.query;
    const response = await amadeusApi.get("shopping/flight-offers", {
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
  } catch (e) {
    res.json({ e: e.message });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
