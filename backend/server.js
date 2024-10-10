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
  const textSeatchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?location=${lat},${lng}&query=${hotelName}&radius=10&key=${process.env.PLACES_API_KEY}`;

  try {
    const response = await axios.get(textSeatchUrl);
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
  https://maps.googleapis.com/maps/api/place/nearbysearch/json
  ?keyword=food
  &location=${longitude}%2C${latitude}
  &radius=100
  &type=restaurant
  &key=${process.env.PLACES_API_KEY}
  `;

  try {
    const response = await axios.get(placeDetailsUrl);
    const photos = response.data.result.photos || [];
    const photoReferences = photos.map((photo) => photo.photo_reference);
    return placeDetailsUrl;
  } catch (error) {
    console.error("Error fetching Place Details:", error.message);
    throw error;
  }
};

app.get("/api/food-info", async (req, res) => {
  const {lat, lng} = req.query;

  try {
    const foodInfo = await getFoodInArea(lat, lng);

    if(foodInfo.length === 0) {
      return res
        .status(404)
        .json({message: "No Info for this place"});
    }

    res.json ({info : foodInfo});
  } catch (error) {
    console.error("Error fetching Food Details:", error.message);
    //res.status(500).json({ error: "Failed to fetch food."});
    res.json({ //// THIS IS TEMPORARY FOR TESTING
      "business_status": "OPERATIONAL",
      "geometry":
        {
          "location": { "lat": -33.8587323, "lng": 151.2100055 },
          "viewport":
            {
              "northeast":
                { "lat": -33.85739847010727, "lng": 151.2112436298927 },
              "southwest":
                { "lat": -33.86009812989271, "lng": 151.2085439701072 },
            },
        },
      "icon": "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/bar-71.png",
      "icon_background_color": "#FF9E67",
      "icon_mask_base_uri": "https://maps.gstatic.com/mapfiles/place_api/icons/v2/bar_pinlet",
      "name": "Cruise Bar",
      "opening_hours": { "open_now": false },
      "photos":
        [
          {
            "height": 608,
            "html_attributions":
              [
                '<a href="https://maps.google.com/maps/contrib/112582655193348962755">A Google User</a>',
              ],
            "photo_reference": "Aap_uECvJIZuXT-uLDYm4DPbrV7gXVPeplbTWUgcOJ6rnfc4bUYCEAwPU_AmXGIaj0PDhWPbmrjQC8hhuXRJQjnA1-iREGEn7I0ZneHg5OP1mDT7lYVpa1hUPoz7cn8iCGBN9MynjOPSUe-UooRrFw2XEXOLgRJ-uKr6tGQUp77CWVocpcoG",
            "width": 1080,
          },
        ],
      "place_id": "ChIJi6C1MxquEmsR9-c-3O48ykI",
      "plus_code":
        {
          "compound_code": "46R6+G2 The Rocks, New South Wales",
          "global_code": "4RRH46R6+G2",
        },
      "price_level": 2,
      "rating": 4,
      "reference": "ChIJi6C1MxquEmsR9-c-3O48ykI",
      "scope": "GOOGLE",
      "types":
        ["bar", "restaurant", "food", "point_of_interest", "establishment"],
      "user_ratings_total": 1269,
      "vicinity": "Level 1, 2 and 3, Overseas Passenger Terminal, Circular Quay W, The Rocks",
    });
  }
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
}
)
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
