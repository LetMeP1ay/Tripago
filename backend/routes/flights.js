const express = require("express");
const dotenv = require("dotenv");
const { getJson } = require("serpapi");

dotenv.config();
const port = process.env.PORT;
const router = express.Router();

const serpUrl = "https://serpapi.com/search";
const serpKey = process.env.SERP_KEY;

router.get("/one-way", async (req, res) => {
  const {
    departure_id,
    arrival_id,
    departure_date,
    adults,
    flight_class,
    currency = "USD",
    hl = "en",
    type,
  } = req.query;

  if (
    !departure_id ||
    !arrival_id ||
    !departure_date ||
    !adults ||
    !flight_class
  ) {
    return res
      .status(400)
      .json({ error: "Missing required parameters for one-way flight" });
  }

  try {
    const response = await getJson({
      api_key: serpKey,
      engine: "google_flights",
      departure_id,
      arrival_id,
      hl,
      currency,
      outbound_date: departure_date,
      travel_class: flight_class,
      type,
    });

    res.json(response);
  } catch (e) {
    console.error("Error fetching one-way flight data:", e);
    res.status(500).json({ error: "Failed to fetch one-way flight data" });
  }
});

router.get("/round-trip", async (req, res) => {
  const {
    departure_id,
    arrival_id,
    hl = "en",
    currency = "USD",
    adults,
    departure_date,
    return_date,
    flight_class,
    type,
  } = req.query;

  if (
    !departure_id ||
    !arrival_id ||
    !departure_date ||
    !return_date ||
    !adults ||
    !flight_class
  ) {
    return res
      .status(400)
      .json({ error: "Missing required parameters for round-trip flight" });
  }

  try {
    const response = await getJson({
      api_key: serpKey,
      engine: "google_flights",
      departure_id,
      arrival_id,
      hl,
      currency,
      outbound_date: departure_date,
      return_date,
      adults,
      travel_class: flight_class,
      type,
    });
    res.json(response);
  } catch (e) {
    console.error("Error fetching round-trip flight data:", e);
    res.status(500).json({ error: "Failed to fetch round-trip flight data" });
  }
});

module.exports = router;
