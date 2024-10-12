"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import HotelButton from "@/components/HotelButton";
import HotelCard from "@/components/HotelCard";

interface HotelOffer {
  type: string;
  hotel: {
    type: string;
    hotelId: string;
    name: string;
    cityCode: string;
    latitude: number;
    longitude: number;
  };
  available: boolean;
  offers?: Array<{
    id: string;
    checkInDate: string;
    checkOutDate?: string;
    price: {
      currency: string;
      total: string;
    };
    room: {
      typeEstimated: {
        category: string;
        beds: number;
        bedType: string;
      };
      description: {
        text: string;
      };
    };
  }>;
  self: string;
}

interface HotelRating {
  hotelId: string;
  overallRating: number;
  numberOfReviews: number;
  sentiments: {
    staff: number;
    location: number;
    service: number;
    roomComforts: number;
    internet: number;
    sleepQuality: number;
    valueForMoney: number;
    facilities: number;
    catering: number;
    pointsOfInterest: number;
  };
}

interface RatingWarning {
  code: number;
  title: string;
  detail: string;
  source: {
    parameter: string;
    pointer: string;
  };
}

const BATCH_SIZE = 15;
const RATING_BATCH_SIZE = 3;

export default function HotelBookings() {
  const router = useRouter();

  const query = new URLSearchParams(window.location.search);
  const cityCode = query.get("cityCode") || "";
  const checkInDate = query.get("checkInDate") || "";
  const checkOutDate = query.get("checkOutDate") || "";
  const adults = query.get("adults") || "1";

  const [hotelOffers, setHotelOffers] = useState<HotelOffer[]>([]);
  const [hotelRatings, setHotelRatings] = useState<HotelRating[]>([]);
  const [ratingWarnings, setRatingWarnings] = useState<RatingWarning[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [allHotelIds, setAllHotelIds] = useState<string[]>([]);
  const [currentBatch, setCurrentBatch] = useState<number>(0);
  const [hotelImages, setHotelImages] = useState<Record<string, string[]>>({});

  const fetchHotelsByCity = async (): Promise<string[]> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/hotels?cityCode=${cityCode}`
      );
      const data = await response.json();
      const hotelIds = data?.data?.map(
        (hotel: { hotelId: string }) => hotel.hotelId
      );
      return hotelIds;
    } catch (error) {
      console.error("Error fetching hotels by city:", error);
      setError("Failed to fetch hotels.");
      return [];
    }
  };

  const fetchHotelOffers = async (hotelIds: string[]) => {
    if (!cityCode || !checkInDate || hotelIds.length === 0) {
      setError("Missing city code, dates, or hotel IDs.");
      return;
    }

    setLoading(true);
    setError(null);

    const hotelIdsParam = hotelIds.join(",");

    let queryString = `hotelIds=${hotelIdsParam}&checkInDate=${checkInDate}&adults=${adults}`;

    if (checkOutDate) {
      queryString += `&checkOutDate=${checkOutDate}`;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/hotel-offers?${queryString}`
      );
      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        const availableOffers = data.data.filter(
          (offer: HotelOffer) => offer.available
        );

        setHotelOffers((prevOffers) => [...prevOffers, ...availableOffers]);
        setError(null);

        const availableHotelIds = availableOffers.map(
          (offer: HotelOffer) => offer.hotel.hotelId
        );

        await fetchHotelRatingsInBatches(availableHotelIds);
        await fetchImagesForHotels(availableOffers);
      } else {
        setError("No hotel offers found.");
      }
    } catch (error) {
      console.error("Error fetching hotel offers:", error);
      setError("Failed to fetch hotel offers.");
    } finally {
      setLoading(false);
    }
  };

  const fetchHotelRatings = async (hotelIds: string[]) => {
    if (hotelIds.length === 0) return;

    try {
      const hotelIdsParam = hotelIds.join(",");
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/hotel-ratings?hotelIds=${hotelIdsParam}`
      );
      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        setHotelRatings((prevRatings) => [...prevRatings, ...data.data]);
      }

      if (data.warnings && Array.isArray(data.warnings)) {
        setRatingWarnings((prevWarnings) => [
          ...prevWarnings,
          ...data.warnings,
        ]);
      }
    } catch (error) {
      console.error("Error fetching hotel ratings:", error);
    }
  };

  const fetchHotelRatingsInBatches = async (hotelIds: string[]) => {
    for (let i = 0; i < hotelIds.length; i += RATING_BATCH_SIZE) {
      const batch = hotelIds?.slice(i, i + RATING_BATCH_SIZE);
      await fetchHotelRatings(batch);
    }
  };

  const fetchNextBatch = async () => {
    const startIndex = currentBatch * BATCH_SIZE;
    const endIndex = startIndex + BATCH_SIZE;
    const batch = allHotelIds?.slice(startIndex, endIndex);
    if (batch?.length > 0) {
      await fetchHotelOffers(batch);
      setCurrentBatch(currentBatch + 1);
    }
  };

  const fetchImagesForHotels = async (hotelOffers: HotelOffer[]) => {
    try {
      for (let offer of hotelOffers) {
        const { name, latitude, longitude } = offer.hotel;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/hotel-images?hotelName=${name}&lat=${latitude}&lng=${longitude}`
        );
        const data = await response.json();
        setHotelImages((prevImages) => ({
          ...prevImages,
          [offer.hotel.hotelId]: data.photos || [],
        }));
      }
    } catch (error) {
      console.error("Error fetching hotel images:", error);
    }
  };

  useEffect(() => {
    const fetchOffersInBatches = async () => {
      const hotelIds = await fetchHotelsByCity();
      setAllHotelIds(hotelIds);
      setCurrentBatch(0);
      if (hotelIds?.length > 0) {
        await fetchNextBatch();
      }
    };

    fetchOffersInBatches();
  }, [cityCode, checkInDate, checkOutDate]);

  const numFeatured = 3;

  return (
    <div
      className={`flex-col justify-start items-center gap-[15px] inline-flex w-full p-6 ${
        hotelOffers.length > 0 ? "h-auto" : "h-full"
      } bg-white text-black`}
    >
      <div className="flex justify-between items-center w-full md:text-xl">
        <div>
          <p className="opacity-50">Discover your</p>
          <p className="font-bold">perfect place to stay</p>
        </div>

        <div className="px-[15px] py-2.5 bg-white rounded-[50px] border-2 border-black/10 flex items-center w-1/2">
          <input
            className="text-black/50 text-xs md:text-xl font-bold w-full outline-none"
            placeholder="211B Baker Street"
          />
          <Image
            alt="icon"
            src="/Arrow.svg"
            height={20}
            width={20}
            className="h-3 w-3 md:h-5 md:w-5"
          />
        </div>
      </div>
      <div className="flex w-full gap-[15px] mt-4">
        <div className="w-1/2 h-10 bg-[#ebebeb] rounded-[50px] flex items-center gap-2.5 p-2.5">
          <Image
            alt="icon"
            src="/Search.svg"
            height={20}
            width={20}
            className="h-4 w-4 md:h-5 md:w-5"
          />
          <input
            placeholder="Search hotel"
            className="bg-[#ebebeb] outline-none w-full md:text-xl"
          />
        </div>

        <button
          className="transition-all duration-600 ease-in-out w-1/2 h-10 bg-[#ebebeb] hover:bg-[#DADADA] active:bg-[#CCCCCC] rounded-[50px] flex justify-center items-center gap-2.5"
          onClick={() => router.push("/")}
        >
          <p className="w-full text-center opacity-50">Open Map</p>
        </button>
      </div>

      <div className="flex justify-between items-center w-full gap-[15px] text-xs md:text-lg md:mt-12 overflow-x-scroll md:overflow-hidden scrollbar mt-4">
        <div className="flex md:flex-col w-max md:w-1/4 h-full">
          <HotelButton label="Hotel" isActive />
          <HotelButton label="Apartments" isActive={false} />
          <HotelButton label="Condo" isActive={false} />
          <HotelButton label="Mansion" isActive={false} />
          <HotelButton label="Homeless" isActive={false} />
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {hotelOffers.length > 0 && (
        <div
          className={`grid grid-cols-1 lg:grid-cols-${numFeatured} gap-4 mb-8 mt-6`}
        >
          {hotelOffers
            .filter((offer) => offer.available)
            .slice(0, numFeatured)
            .map((offer) => {
              const images = hotelImages[offer.hotel.hotelId] || [];
              const rating = hotelRatings.find(
                (r) => r.hotelId === offer.hotel.hotelId
              );

              return (
                <HotelCard
                  key={offer.hotel.hotelId}
                  offer={offer}
                  images={images}
                  rating={rating}
                  featured={true}
                />
              );
            })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {hotelOffers.length > numFeatured &&
          hotelOffers
            .filter((offer) => offer.available)
            .slice(numFeatured)
            .map((offer) => {
              const images = hotelImages[offer.hotel.hotelId] || [];
              const rating = hotelRatings.find(
                (r) => r.hotelId === offer.hotel.hotelId
              );

              return (
                <HotelCard
                  key={offer.hotel.hotelId}
                  offer={offer}
                  images={images}
                  rating={rating}
                  featured={false}
                />
              );
            })}
      </div>

      {currentBatch * BATCH_SIZE < allHotelIds?.length && (
        <button
          onClick={fetchNextBatch}
          className="bg-blue-500 text-white rounded-lg p-2 mt-4"
        >
          Load More Hotels
        </button>
      )}
    </div>
  );
}
