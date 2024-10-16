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

const getPlaceId = async (hotelName, lat, lng) => {
  const textSearchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?location=${lat},${lng}&query=${hotelName}&radius=10&key=${process.env.PLACES_API_KEY}`;

  try {
    const response = await axios.get(textSearchUrl);
    const placeId = response.data.results[0]?.place_id;

    if (!placeId) {
      throw new Error("Place ID not found.");
    }
    return placeId;
  } catch (error) {
    console.error("Error fetching Place ID:", error.message);
    throw error;
  }
};

const getPhotoReferences = async (placeId) => {
  const placeDetailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${process.env.PLACES_API_KEY}`;

  try {
    const response = await axios.get(placeDetailsUrl);
    const photos = response.data.result.photos || [];
    const photoReferences = photos.map((photo) => photo.photo_reference);
    return photoReferences;
  } catch (error) {
    console.error("Error fetching Place Details:", error.message);
    throw error;
  }
};

const getPhotoUrl = (photoReference, maxWidth = 400) => {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${photoReference}&key=${process.env.PLACES_API_KEY}`;
};

app.get("/api/hotel-images", async (req, res) => {
  const { hotelName, lat, lng } = req.query;

  try {
    const placeId = await getPlaceId(hotelName, lat, lng);

    const photoReferences = await getPhotoReferences(placeId);

    if (photoReferences.length === 0) {
      return res
        .status(404)
        .json({ message: "No photos available for this hotel." });
    }

    const photoUrls = photoReferences.map((ref) => getPhotoUrl(ref));

    res.json({ photos: photoUrls });
  } catch (error) {
    console.error("Error fetching hotel images:", error.message);
    res.status(500).json({ error: "Failed to fetch hotel images." });
  }
});

const getFoodInArea = async (latitude, longitude) => {
  const placeDetailsUrl = `
  https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=food&location=${latitude}%2C${longitude}&radius=250&type=restaurant&key=${process.env.FOOD_API_KEY}`;

  try {
    const response = await axios.get(placeDetailsUrl);
    console.log(response);
    return response.data?.results;
  } catch (error) {
    console.error("Error fetching Place Details:", error.message);
    throw error;
  }
};

app.get("/api/food-info", async (req, res) => {
  const { lat, lng } = req.query;

  try {
    const foodInfo = await getFoodInArea(lat, lng);

    const photoReferences = foodInfo.map((placeInfo) => placeInfo.photos.map((photo) => photo.photo_reference))
    const photoWidths = foodInfo.map((placeInfo) => placeInfo.photos.map((photo) => photo.width))

    console.log(photoReferences);
    console.log(photoWidths);

    const photoUrls = [];
    for(i in photoReferences) {
      photoUrls.push(getPhotoUrl(photoReferences[i], photoWidths[i]));
    }
    // add to array
    console.log(photoUrls);


    if (foodInfo.length === 0) {
      return res.status(404).json({ message: "No Info for this place" });
    }
    res.json( {foodInfo, photoUrls} );
  } catch (error) {
    console.error("Error fetching Food Details:", error.message);
    res.status(500).json({ error: "Failed to fetch food." });
  }
});

app.get("/api/food-info-test", async (req, res) => {
  const data = req.query;
  res.json(data);
});

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
      currencyCode,
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

app.get("/api/hotel-data", async (req, res) => {
  const { hotelName, lat, lng } = req.query;

  try {
    const { placeId, rating, photoReference, photoWidth, streetAddress } =
      await getPlaceData(hotelName, lat, lng);

    const photoUrl = getPhotoUrl(photoReference, photoWidth);

    res.json({ placeId, photoUrl, rating, streetAddress });
  } catch (error) {
    console.error("Error fetching hotel images:", error.message);
    res.status(500).json({ error: "Failed to fetch hotel data." });
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

app.get("/api/hotel-offers", async (req, res) => {
  try {
    const token = await getAccessToken();

    const {
      cityCode,
      checkInDate,
      checkOutDate,
      adults,
      roomQuantity,
      hotelId,
      currency = "USD",
      includeClosed,
      bestRateOnly,
      priceRange,
    } = req.query;

    const params = {
      cityCode,
      checkInDate,
      checkOutDate,
      adults,
      roomQuantity,
      hotelId,
      currency,
      includeClosed,
      bestRateOnly,
      priceRange,
    };

    const response = await amadeusApiV2.get("shopping/hotel-offers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel offers" });
  }
});

app.get("/api/hotel-offers", async (req, res) => {
  try {
    const token = await getAccessToken();

    const {
      cityCode,
      checkInDate,
      checkOutDate,
      adults,
      roomQuantity,
      hotelId,
      currency = "USD",
      includeClosed,
      bestRateOnly,
      priceRange,
    } = req.query;

    const params = {
      cityCode,
      checkInDate,
      checkOutDate,
      adults,
      roomQuantity,
      hotelId,
      currency,
      includeClosed,
      bestRateOnly,
      priceRange,
    };

    const response = await amadeusApiV2.get("shopping/hotel-offers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel offers" });
  }
});

app.get("/api/hotel-offers", async (req, res) => {
  try {
    const token = await getAccessToken();

    const {
      cityCode,
      checkInDate,
      checkOutDate,
      adults,
      roomQuantity,
      hotelId,
      currency = "USD",
      includeClosed,
      bestRateOnly,
      priceRange,
    } = req.query;

    const params = {
      cityCode,
      checkInDate,
      checkOutDate,
      adults,
      roomQuantity,
      hotelId,
      currency,
      includeClosed,
      bestRateOnly,
      priceRange,
    };

    const response = await amadeusApiV2.get("shopping/hotel-offers", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch hotel offers" });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
