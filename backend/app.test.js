const request = require("supertest");
const nock = require("nock");
const { app } = require("./app");
const { getAccessToken } = require("./app");

describe("GET /api/hotel-data", () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  test("should return hotel data", async () => {
    const hotelName = "Grand Hotel";
    const lat = "40.7128";
    const lng = "-74.0060";

    const googleTextSearchScope = nock("https://maps.googleapis.com")
      .get("/maps/api/place/textsearch/json")
      .query((actualQueryObject) => {
        return (
          actualQueryObject.location === `${lat},${lng}` &&
          actualQueryObject.query === hotelName &&
          actualQueryObject.radius === "10" &&
          actualQueryObject.key === process.env.PLACES_API_KEY
        );
      })
      .reply(200, {
        results: [
          {
            place_id: "test-place-id",
            photos: [
              {
                photo_reference: "test-photo-ref",
                width: 800,
              },
            ],
            rating: 4.5,
            formatted_address: "123 Main St, New York, NY 10001, USA",
          },
        ],
      });

    const response = await request(app)
      .get("/api/hotel-data")
      .query({ hotelName, lat, lng });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      placeId: "test-place-id",
      photoUrl: expect.stringContaining(
        "https://maps.googleapis.com/maps/api/place/photo"
      ),
      rating: 4.5,
      streetAddress: "123 Main St",
    });

    expect(googleTextSearchScope.isDone()).toBe(true);
  });
});

describe("GET /api/hotel-images", () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  test("should return hotel images", async () => {
    const hotelName = "Grand Hotel";
    const lat = "40.7128";
    const lng = "-74.0060";
    const placeId = "test-place-id";

    const textSearchScope = nock("https://maps.googleapis.com")
      .get("/maps/api/place/textsearch/json")
      .query({
        location: `${lat},${lng}`,
        query: hotelName,
        radius: "10",
        key: process.env.PLACES_API_KEY,
      })
      .reply(200, {
        results: [
          {
            place_id: placeId,
          },
        ],
      });

    const detailsScope = nock("https://maps.googleapis.com")
      .get("/maps/api/place/details/json")
      .query({
        place_id: placeId,
        key: process.env.PLACES_API_KEY,
      })
      .reply(200, {
        result: {
          photos: [
            { photo_reference: "photo-ref-1" },
            { photo_reference: "photo-ref-2" },
          ],
        },
      });

    const response = await request(app)
      .get("/api/hotel-images")
      .query({ hotelName, lat, lng });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      photos: [
        expect.stringContaining(
          "https://maps.googleapis.com/maps/api/place/photo"
        ),
        expect.stringContaining(
          "https://maps.googleapis.com/maps/api/place/photo"
        ),
      ],
    });

    expect(textSearchScope.isDone()).toBe(true);
    expect(detailsScope.isDone()).toBe(true);
  });
});

describe("GET /api/food-info", () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  test("should return food info and photo URLs", async () => {
    const lat = "40.7128";
    const lng = "-74.0060";

    const nearbySearchScope = nock("https://maps.googleapis.com")
      .get("/maps/api/place/nearbysearch/json")
      .query({
        location: `${lat},${lng}`,
        radius: "250",
        type: "restaurant",
        keyword: "food",
        key: process.env.FOOD_API_KEY,
      })
      .reply(200, {
        results: [
          {
            name: "Food Place 1",
            photos: [
              {
                photo_reference: "food-photo-ref-1",
                width: 400,
              },
            ],
          },
          {
            name: "Food Place 2",
            photos: [
              {
                photo_reference: "food-photo-ref-2",
                width: 400,
              },
            ],
          },
        ],
      });

    const response = await request(app)
      .get("/api/food-info")
      .query({ lat, lng });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("foodInfo");
    expect(response.body).toHaveProperty("photoUrls");
    expect(response.body.photoUrls.length).toBe(2);
    expect(response.body.photoUrls[0]).toContain(
      "https://maps.googleapis.com/maps/api/place/photo"
    );
    expect(response.body.photoUrls[1]).toContain(
      "https://maps.googleapis.com/maps/api/place/photo"
    );

    expect(nearbySearchScope.isDone()).toBe(true);
  });
});

describe("getAccessToken", () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  test("should return an access token", async () => {
    const tokenScope = nock("https://test.api.amadeus.com")
      .post("/v1/security/oauth2/token")
      .reply(200, {
        access_token: "test-access-token",
        token_type: "Bearer",
        expires_in: 1799,
      });

    const accessToken = await getAccessToken();

    expect(accessToken).toBe("test-access-token");
    expect(tokenScope.isDone()).toBe(true);
  });
});
