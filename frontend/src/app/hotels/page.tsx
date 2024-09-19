"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface HotelOffer {
  type: string;
  hotel: {
    type: string;
    hotelId: string;
    chainCode: string;
    dupeId?: string;
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
    rateCode: string;
    rateFamilyEstimated: {
      code: string;
      type: string;
    };
    room: {
      type: string;
      typeEstimated: {
        category: string;
        beds: number;
        bedType: string;
      };
      description: {
        text: string;
        lang: string;
      };
    };
    guests: {
      adults: number;
    };
    price: {
      currency: string;
      base: string;
      total: string;
      variations: {
        average: {
          base: string;
        };
        changes: Array<{
          startDate: string;
          endDate: string;
          base: string;
        }>;
      };
    };
    policies: {
      cancellations: Array<{
        description: {
          text: string;
        };
        type: string;
      }>;
      paymentType: string;
    };
    self: string;
  }>;
  self: string;
}

const BATCH_SIZE = 20;

export default function HotelBookings() {

  const query = new URLSearchParams(window.location.search);
  const cityCode = query.get("cityCode") || "";
  const checkInDate = query.get("checkInDate") || "";
  const checkOutDate = query.get("checkOutDate") || "";
  const adults = query.get("adults") || "1";

  const [hotelOffers, setHotelOffers] = useState<HotelOffer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [allHotelIds, setAllHotelIds] = useState<string[]>([]);
  const [currentBatch, setCurrentBatch] = useState<number>(0);

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
      console.log(data);

      if (data.data && Array.isArray(data.data)) {
        setHotelOffers((prevOffers) => [...prevOffers, ...data.data]);
        setError(null);
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
    const batch = allHotelIds.slice(startIndex, endIndex);
    if (batch.length > 0) {
      await fetchHotelOffers(batch);
      setCurrentBatch(currentBatch + 1);
    }
  };
  useEffect(() => {
    const fetchOffersInBatches = async () => {
      const hotelIds = await fetchHotelsByCity();
      setAllHotelIds(hotelIds);
      setCurrentBatch(0);
      if (hotelIds.length > 0) {
        await fetchNextBatch();
      }
    };

    fetchOffersInBatches();
  }, [cityCode, checkInDate, checkOutDate]);

  return (
    <div className="flex flex-col p-4 border border-gray-300 w-full rounded-lg mb-4 shadow-lg max-w-[1200px]">
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {hotelOffers.length > 0
        ? hotelOffers.map((offer) => (
            <div key={offer.hotel.hotelId} className="flex flex-col mb-4">
              <h2 className="text-lg font-bold">{offer.hotel.name}</h2>
              <p>Hotel ID: {offer.hotel.hotelId}</p>
              <p>
                Location: {offer.hotel.latitude}, {offer.hotel.longitude}
              </p>

              {offer.available && offer.offers ? (
                offer.offers.map((singleOffer) => (
                  <div
                    key={singleOffer.id}
                    className="mb-4 p-2 border border-gray-200"
                  >
                    <p>
                      Room Type:{" "}
                      {singleOffer.room.typeEstimated?.category || "N/A"}
                    </p>
                    <p>
                      Description: {singleOffer.room.description?.text || "N/A"}
                    </p>
                    <p>
                      Price: {singleOffer.price.total}{" "}
                      {singleOffer.price.currency}
                    </p>
                    <p>Check-in Date: {singleOffer.checkInDate}</p>
                    {singleOffer.checkOutDate && (
                      <p>Check-out Date: {singleOffer.checkOutDate}</p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  No offers available for this hotel.
                </p>
              )}
            </div>
          ))
        : !loading && <p>No hotel offers found for the given criteria.</p>}

      {currentBatch * BATCH_SIZE < allHotelIds.length && (
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
