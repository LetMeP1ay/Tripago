"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCountryFromCoordinates,
  getUserCoords,
  getUserLocation,
} from "@/services/locationService";
import testData from '../../../../backend/Temp.json';
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
}

export default function FindFood() {
  const router = useRouter();

  //const query = new URLSearchParams(window.location.search);
  //const cityCode = query.get("cityCode") || "";

  const [foodOffers, setFoodOffers] = useState<FoodOffer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [foodImages, setFoodImages] = useState<Record<string, string[]>>({});
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
    getLocation();
  }, []);

  console.log(latitude, longitude);

  const fetchFoodByLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/food-info?lat=${latitude}&lng=${longitude}`
      );
      const location = await response.json();
      setFoodOffers(location);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching food by city:", error);
      setError("Failed to fetch food.");
      return [];
    }
  };

  function haversineDistance(lat1?: number, lon1?: number, lat2?: number, lon2?: number): string | null{
    if (
      lat1 === undefined || lon1 === undefined ||
      lat2 === undefined || lon2 === undefined
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
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    let distanceKm =  R * c; // Distance in kilometers

    if (distanceKm < 1) {
      return `${(distanceKm * 1000).toFixed(0)}m`;
    }

    return `${distanceKm.toFixed(1)}km`;
  }

  function toTitleCase(str: string): string {
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function isBooleanDefined(value?: boolean): boolean {
  return value !== undefined;
}

  const gap = "15px";
  const desktopImgSize = "w-[300px] h-[220px]";
  const mobileImgSize = "w-[250px] h-[110px]";
  const numFeatured = 5;
  return (
    <div
      className={`px-[${gap}] py-[15px] flex-col justify-start items-center gap-[15px] inline-flex w-screen bg-white text-black md:overflow-x-hidden`}
    >
      {loading && <p>Loading...</p>}
      <div className="justify-between items-center inline-flex w-full">
        <div>
          <p>What Would you like to eat?</p>
        </div>

        <div className="px-[15px] py-2.5 bg-white rounded-[50px] border-2 border-black/10 items-center flex w-1/2">
          <div className="text-black/50 text-xs font-extrabold font-['Urbanist']">
            211B Baker Street
          </div>
          <img
            className="w-[15px] h-2.5"
            src="https://via.placeholder.com/15x10"
          />
        </div>
      </div>
      <div className="justify-between items-center inline-flex w-full gap-[15px]">
        <div className="grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex">
          <p>Search Food</p>
        </div>
      </div>
      <div className="justify-between items-center inline-flex w-full gap-[15px]">
        <div className="grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex">
          <p>Ratings</p>
        </div>
        <div className="grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex">
          <p>Open Now</p>
        </div>
        <div className="grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex">
          <p>Price</p>
        </div>
      </div>
      
      <div>
        
      {foodOffers.length > 0 ? (
        <div>
        {foodOffers.slice().map((offer) => (
          <div key={offer.place_id} className="pt-[30px]"> {/*whole food card*/}
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-gray-400"></div>
              <span className="flex-shrink mx-8 text-gray-600 text-xl font-medium">
                <h1>{offer.name}</h1> {/*Name*/}
              </span>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
            <div className="flex overflow-x-auto space-x-[15px] w-screen px-[15px]"> {/*Images*/}
              <div className={`${desktopImgSize} flex-shrink-0 rounded-[15px] justify-center items-center flex overflow-y-hidden`}> {/*Image Div*/}
                <img className="w-[175] h-[175]" src="https://via.placeholder.com/400x400"/>
                
              </div>
            </div> {/*Images End*/}
            <div> {/*Bio*/}
              <div className="justify-center items-end inline-flex flex-1 w-screen gap-[15px] px-[15px]"> {/*Information*/}
                <div> {/*Rating*/}
                  <p className="flex flex-row">
                    {offer.rating}<Rating value={offer.rating || 0} precision={0.1} readOnly className="px-2"/>{"("}{offer.user_ratings_total}{")"},
                  </p>
                </div>
                <div> {/*Price*/}
                  <p>{"$".repeat(offer.price_level)||"$"},</p>
                </div>
                <div> {/*Distance*/}
                  <p>{haversineDistance(offer.geometry.location.lat, offer.geometry.location.lng, latitude, longitude)}</p>
                </div>
              </div> {/*Information end*/}
              <div className="justify-center items-between inline-flex flex-1 w-screen gap-[15px] px-[15px]"> {/*Information cont*/}
                <div>
                  <p>{toTitleCase(offer.types[0])},</p>
                </div>
                <div>
                  <p>{offer.vicinity}</p>
                </div>
                <div>
                  <p>(🧑‍🦽‍➡️)dont think we can have</p>
                </div>
              </div> {/*Information cont end*/}
              <div className="justify-center items-between inline-flex flex-1 w-screen gap-[15px] px-[15px]"> {/*Opening info*/}
                <div>
                  <p>
                    {isBooleanDefined(offer.opening_hours.open_now) ? (
                      offer.opening_hours.open_now ? (
                        "Open"
                      ) : (
                        "Closed"
                      )
                    ) : (
                      "Closed"
                    )}
                    </p>
                </div>
                <div>
                  <p>-</p>
                </div>
                <div>
                  <p>(Closes 10:30 pm) suprisingly i dont think we can have this either</p>
                </div>
              </div>
            </div> {/*Opening info end*/}
            <div className="justify-center items-between inline-flex flex-1 w-screen gap-[15px] px-[15px]"> {/*Action Buttons*/}
              <div className="w-1/2 justify-between items-center inline-flex gap-[15px]"> {/*Buttons (restricting to half the screen)*/}
                <div className="justify-between items-center inline-flex w-full gap-[15px]"> {/*buttons list */}
                  <div className="grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex">
                    <p>Directions</p>
                  </div>
                  <div className="grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex">
                    <p>Call</p>
                  </div>
                  <div className="grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex">
                    <p>Wishlist</p>
                  </div>
                </div>
              </div>
            </div> {/*Action Buttons end*/}
          </div>
        ))}
      </div>
      ) : (
        <p>No offers.</p>
      )} {/*whole food card end*/}
      </div>
      <button onClick={()=>console.log(foodOffers)}>Print Food offers</button>
      {latitude && longitude && <button
        onClick={() => { fetchFoodByLocation(); }}> load </button>}
    </div>
  );
}