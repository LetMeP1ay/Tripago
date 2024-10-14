"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import HotelButton from "@/components/HotelButton";
import HotelCard from "@/components/HotelCard";
import { VscSettings } from "react-icons/vsc";
import HotelSearchBar from "@/components/HotelSearchBar";

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

const BATCH_SIZE = 15;

interface HotelData {
  image: string;
  rating: number;
  streetAddress: string;
}

export default function HotelBookings() {
  const router = useRouter();

  const query = new URLSearchParams(window.location.search);
  const cityCode = query.get("cityCode") || "";
  const checkInDate = query.get("checkInDate") || "";
  const checkOutDate = query.get("checkOutDate") || "";
  const adults = query.get("adults") || "1";

  const [hotelOffers, setHotelOffers] = useState<HotelOffer[]>([]);
  const [hotelData, setHotelData] = useState<Record<string, HotelData>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [allHotelIds, setAllHotelIds] = useState<string[]>([]);
  const [currentBatch, setCurrentBatch] = useState<number>(0);
  const [countryCode, setCountryCode] = useState<string>("");

  const fetchHotelsByCity = async (): Promise<string[]> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/hotels?cityCode=${cityCode}`
      );
      const data = await response.json();
      const hotelIds = data?.data?.map(
        (hotel: { hotelId: string }) => hotel.hotelId
      );

      if (data?.data?.length > 0) {
        const countryCodeFromResponse =
          data.data[0]?.address?.countryCode || "";
        setCountryCode(countryCodeFromResponse);
      }

      return hotelIds;
    } catch (error) {
      console.error("Error fetching hotels by city:", error);
      setError("Failed to fetch hotels.");
      return [];
    }
  };

  const fetchHotelOffers = async (hotelIds: string[]) => {
    if ((!cityCode && hotelIds.length === 0) || !checkInDate) {
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

        await fetchHotelDataForHotels(availableOffers);
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

  const fetchNextBatch = async () => {
    const startIndex = currentBatch * BATCH_SIZE;
    const endIndex = startIndex + BATCH_SIZE;
    const batch = allHotelIds?.slice(startIndex, endIndex);
    if (batch?.length > 0) {
      await fetchHotelOffers(batch);
      setCurrentBatch(currentBatch + 1);
    }
  };

  const fetchHotelDataForHotels = async (hotelOffers: HotelOffer[]) => {
    try {
      for (let offer of hotelOffers) {
        const { name, latitude, longitude, hotelId } = offer.hotel;
        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/api/hotel-data?hotelName=${encodeURIComponent(
            name
          )}&lat=${latitude}&lng=${longitude}`
        );
        const data = await response.json();
        const { photoUrl, rating, streetAddress } = data;

        setHotelData((prevData) => ({
          ...prevData,
          [hotelId]: {
            image: photoUrl,
            rating: rating,
            streetAddress: streetAddress,
          },
        }));
      }
    } catch (error) {
      console.error("Error fetching hotel data:", error);
    }
  };

  const handleHotelSelect = async (hotelIds: string[]) => {
    setHotelOffers([]);
    await fetchHotelOffers(hotelIds);
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
          <HotelSearchBar
            countryCode={countryCode}
            onHotelSelect={handleHotelSelect}
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
        <div className="flex w-max md:w-full h-full">
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
        <div className="flex w-full overflow-x-scroll md:overflow-hidden scrollbar md:justify-center">
          <div className="flex gap-4">
            {hotelOffers
              .filter((offer) => offer.available)
              .slice(0, numFeatured)
              .map((offer) => {
                const hotelId = offer.hotel.hotelId;
                const data = hotelData[hotelId] || {};
                const image = data.image || "";
                const rating = data.rating || null;
                const streetAddress = data.streetAddress || "";

                return (
                  <div key={hotelId} className="flex-shrink-0">
                    <HotelCard
                      offer={offer}
                      streetAddress={streetAddress}
                      image={image}
                      rating={rating || 0}
                      featured={true}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      )}

      <div className="flex w-full justify-between items-center font-Urbanist">
        <p className="font-bold text-2xl">Hotels Nearby</p>
        <button className="flex justify-center items-center bg-[#ECECEC] opacity-50 rounded-[50px] p-2 md:p-3 px-2 md:px-8">
          <p className="sm:pr-1">Filter</p>
          <VscSettings className="rotate-[90deg] h-6 w-6" />
        </button>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {hotelOffers.length > numFeatured &&
          hotelOffers
            .filter((offer) => offer.available)
            .slice(numFeatured)
            .map((offer) => {
              const hotelId = offer.hotel.hotelId;
              const data = hotelData[hotelId] || {};
              const image = data.image || "";
              const rating = data.rating || null;
              const streetAddress = data.streetAddress || "";

              return (
                <HotelCard
                  key={hotelId}
                  streetAddress={streetAddress}
                  offer={offer}
                  image={image}
                  rating={rating || 0}
                  featured={false}
                />
              );
            })}
      </div>

      {currentBatch * BATCH_SIZE < allHotelIds?.length && (
        <button
          onClick={fetchNextBatch}
          className="bg-[#71D1FC] hover:bg-[#5BBEEB] active:bg-[#5AAEEA] transition-all duration-600 ease-in-out text-white rounded-lg p-2 mt-4"
        >
          Load More Hotels
        </button>
      )}
    </div>
  );
}
