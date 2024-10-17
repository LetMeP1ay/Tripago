"use client";

import { useEffect, useState } from "react";
import { Rating } from "@mui/material";

interface FoodOffer {
  types: string[];
  name: string;
  place_id: string;
  price_level: number;
  rating: number;
  user_ratings_total: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  opening_hours: {
    open_now: boolean;
  };
  vicinity: string;
  food: {
    type: string;
    foodId: string;
    latitude: number;
    longitude: number;
  };
  available: boolean;
  open: boolean;
  self: string;
  photo: string;
}

export default function FindFood() {
  const [foodOffers, setFoodOffers] = useState<FoodOffer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [finding, setFinding] = useState<boolean>(true);
  const [foodImages, setFoodImages] = useState<string[]>([]);
  const [latitude, setLatitude] = useState<number>();
  const [longitude, setLongitude] = useState<number>();

  useEffect(() => {
    const getLocation = async () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
          },
          (error) => {
            if (error) {
              setLatitude(-36.8484611);
              setLongitude(174.7597086);
            }
          }
        );
      }
    };
    setFinding(false);
    getLocation();
  }, []);

  const fetchFoodByLocation = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/food-info?lat=${latitude}&lng=${longitude}`
      );
      const { foodInfo, photoUrls } = await response.json();
      setFoodOffers(foodInfo);
      setFoodImages(photoUrls);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching food by city:", error);
      return [];
    }
  };

  function haversineDistance(
    lat1?: number,
    lon1?: number,
    lat2?: number,
    lon2?: number
  ): string | null {
    if (
      lat1 === undefined ||
      lon1 === undefined ||
      lat2 === undefined ||
      lon2 === undefined
    ) {
      console.error("All coordinates must be provided.");
      return null; // Return null to indicate that the function didn't run
    }
    const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    let distanceKm = R * c; // Distance in kilometers

    if (distanceKm < 1) {
      return `${(distanceKm * 1000).toFixed(0)}m`;
    }

    return `${distanceKm.toFixed(1)}km`;
  }

  function toTitleCase(str: string): string {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const desktopImgSize = "w-[300px] h-[220px]";

  return (
    <div
      className={`flex-col justify-start items-center inline-flex w-full bg-white text-black md:overflow-x-hidden`}
    >
      {finding && (
        <div className="text-center">
          <p>Finding your location</p>
          <p>
            if this is taking a while make sure you have location enabled on
            your device
          </p>
        </div>
      )}
      <div>
        {foodOffers?.length > 0 && foodImages?.length ? (
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
            {foodOffers.slice().map((offer, index) => (
              <div key={offer.place_id} className="pb-20">
                {" "}
                {/*whole food card*/}
                <div className={`relative flex items-center`}>
                  <div className="flex-grow border-t border-gray-400"></div>
                  <span className="flex-shrink mx-8 text-gray-600 text-xl font-medium">
                    <h1>{offer.name}</h1> {/*Name*/}
                  </span>
                  <div className="flex-grow border-t border-gray-400"></div>
                </div>
                <div className="flex justify-center items-center overflow-x-auto w-full">
                  {" "}
                  {/*Images*/}
                  <div
                    className={`${desktopImgSize} flex-shrink-0 rounded-[15px] justify-center items-center flex overflow-hidden`}
                  >
                    {" "}
                    {/*Image Div*/}
                    <img
                      className="flex-shrink-0 rounded-[15px] justify-center items-center flex overflow-hidden"
                      src={foodImages[index]}
                    />
                  </div>
                </div>{" "}
                {/*Images End*/}
                <div>
                  {" "}
                  {/*Bio*/}
                  <div
                    className={`justify-center items-end inline-flex flex-1 w-full`}
                  >
                    {" "}
                    {/*Information*/}
                    <div>
                      {" "}
                      {/*Rating*/}
                      <p className="flex flex-row">
                        {offer.rating}
                        <Rating
                          value={offer.rating || 0}
                          precision={0.1}
                          readOnly
                          className="px-2"
                        />
                        {"("}
                        {offer.user_ratings_total}
                        {")"},
                      </p>
                    </div>
                    <div>
                      {" "}
                      {/*Price*/}
                      <p className="mx-2">
                        {"$".repeat(offer.price_level) || "$"},
                      </p>
                    </div>
                    <div>
                      {" "}
                      {/*Distance*/}
                      <p>
                        {haversineDistance(
                          offer.geometry.location.lat,
                          offer.geometry.location.lng,
                          latitude,
                          longitude
                        )}
                      </p>
                    </div>
                  </div>{" "}
                  {/*Information end*/}
                  <div
                    className={`justify-center items-between inline-flex flex-1 w-full`}
                  >
                    {" "}
                    {/*Information cont*/}
                    <div className="pr-2">
                      <p>{toTitleCase(offer.types[0])},</p>
                    </div>
                    <div>
                      <p>{offer.vicinity}</p>
                    </div>
                  </div>{" "}
                  {/*Information cont end*/}
                  <div
                    className={`justify-center items-center text-center inline-flex flex-1 w-full`}
                  >
                    {" "}
                    {/*Opening info*/}
                    <div className="flex justify-center items-center text-center">
                      <p>
                        {offer.opening_hours?.open_now
                          ? "Currently Open"
                          : "Closed Right Now"}
                      </p>
                    </div>
                  </div>
                </div>{" "}
                {/*Opening info end*/}
              </div>
            ))}
          </div>
        ) : (
          <p></p>
        )}{" "}
        {/*whole food card end*/}
      </div>
      {latitude && longitude && foodOffers.length === 0 && (
        <div className="h-full">
          <div className="h-1/3 grid grid-cols-1 content-center">
            <button
              className="bg-[#DADADA] hover:bg-[#CCCCCC] active:bg-[#BBB] rounded-[50px] flex justify-center items-center p-3 px-6 transition-all duration-600 ease-in-out"
              onClick={() => {
                fetchFoodByLocation();
              }}
            >
              Find Something to Eat!
            </button>
          </div>
        </div>
      )}
      {loading && <p className="pt-60">Finding your next meal...</p>}
      {!latitude ||
        (!longitude && (
          <div className="flex h-screen w-screen items-center justify-center">
            <div
              className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-black"
              role="status"
            >
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}
