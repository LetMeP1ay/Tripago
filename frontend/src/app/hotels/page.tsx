"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
        setHotelOffers((prevOffers) => [...prevOffers, ...data.data]);
        setError(null);

        const availableHotelIds = data.data
          .filter((offer: HotelOffer) => offer.available)
          .map((offer: HotelOffer) => offer.hotel.hotelId);

        await fetchHotelRatingsInBatches(availableHotelIds);
        await fetchImagesForHotels(data.data);
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
      const batch = hotelIds.slice(i, i + RATING_BATCH_SIZE);
      await fetchHotelRatings(batch);
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

  const gap = "15px";
  const numFeatured = 3;
  const dispNum = 3;
  return (
    <div
      className={`flex-col justify-start items-center gap-[15px] inline-flex w-full ${
        hotelOffers.length > 0 ? "h-auto" : "h-full"
      } bg-white text-black`}
    >
      <div className="justify-between items-center inline-flex w-full md:text-xl">
        <div>
          <p className="opacity-50">Discover your</p>
          <p className="font-bold">perfect place to stay</p>
        </div>

        <div className="px-[15px] py-2.5 bg-white rounded-[50px] border-2 border-black/10 justify-between items-center flex w-1/2">
          <input className="text-black/50 text-xs md:text-xl font-bold w-full outline-none" placeholder="211B Baker Street">
          </input>
          <Image alt="icon" src="Arrow.svg" height={15} width={15} />
        </div>
      </div>
      <div className="justify-between items-center inline-flex w-full gap-[15px]">
        <div className="grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex">
          <p>Search Hotel</p>
        </div>
        <div className="grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex">
          <p>Open Map</p>
        </div>
      </div>
      <div className="justify-between items-center inline-flex w-full gap-[15px]">
        <div className="grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex">
          <p>Hotel</p>
        </div>
        <div className="grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex">
          <p>Apartments</p>
        </div>
        <div className="grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex">
          <p>Condo</p>
        </div>
        <div className="grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex">
          <p>Mansion</p>
        </div>
        <div className="grow shrink basis-0 h-[33px] bg-[#ebebeb] rounded-[50px] justify-center items-center gap-2.5 flex">
          <p>Mansion</p>
        </div>
      </div>
      {/*
      sdfsdfsdfdgsdfgfdsg
        <div className="w-[272px] h-[152px] relative rounded-[10px] overflow-y-hidden">
          <img className="w-[272px] h-[204px] left-0 top-[-13px] absolute" src="https://via.placeholder.com/272x204" />
          <div className="absolute justify-between items-end gap-[120px] inline-flex w-full px-[15px] py-[12px] h-full text-white">
            <div className="left-[14px] left-0 text-base font-medium">
              <p>NAME</p>
              <p>$PRICE</p>
            </div>
            <div className="justify-left items-left flex text-left">
              <p>⭐RATING</p>
            </div>
          </div>
        </div>
        dsjgvfsdfghvsdfghvgh
      <div className="justify-between items-center gap-3.5 inline-flex w-full">
        <div className="w-175 h-175 rounded-[15px] justify-end items-center flex overflow-y-hidden">
          <img className="w-[175] h-[175]" src="https://via.placeholder.com/175x175" />
        </div>
        <div className="relative items-start justify-start">
          <p>NAME OF HOTEL</p>
          <p>Location of hotel</p>
        </div>
        <div className="relative justify-end items-end">
          <p>$PRICE</p>
          <p>⭐RATING</p>
        </div>
      </div>
      hgdbfnkbmvjdhsbfnm gkhbjvhgcbx df*/}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {hotelOffers.length > 0 && (
        <div
          className={`grid grid-cols-1 lg:grid-cols-${numFeatured} gap-4 mb-8`}
        >
          {hotelOffers.slice(0, numFeatured).map((offer) => (
            //put the smaller cards in a div that is a 3 colom wide at large size and 1 wide when its thin
            // make the image the size of its box, with a matching height to stop the overlapping with name
            <div
              key={offer.hotel.hotelId}
              className="w-[272px] h-[150px] relative overflow-y-hidden rounded-[10px]"
            >
              {hotelImages[offer.hotel.hotelId] &&
              hotelImages[offer.hotel.hotelId].length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {hotelImages[offer.hotel.hotelId].map((imageUrl, index) => (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={`Hotel ${offer.hotel.name} image ${index + 1}`}
                      className={` ${
                        index === 0
                          ? "w-90 h-90 object-cover rounded-[10px]"
                          : "hidden"
                      }`}
                    />
                  ))}
                  <div className="absolute justify-between items-start flex flex-col w-full px-[15px] h-full text-white bg-black bg-opacity-50">
                    <p className="text-xs font-light">{offer.hotel.name}</p>
                    <div className="text-xs left-[14px] left-0 text-base font-light">
                      {offer.available && offer.offers ? (
                        offer.offers.map((singleOffer) => (
                          <>
                            <div key={singleOffer.id}>
                              <p>
                                Price: {singleOffer.price.total}{" "}
                                {singleOffer.price.currency}
                              </p>
                            </div>
                            <div className="justify-left items-left flex text-left">
                              <h3 className="font-semibold">Rating: ⭐4.8</h3>
                            </div>
                          </>
                        ))
                      ) : (
                        <p>No offers available for this hotel.</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p>No images available for this hotel.</p>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {hotelOffers.length > 3 &&
          hotelOffers.slice(numFeatured).map((offer) => (
            <div
              key={offer.hotel.hotelId}
              className="justify-between items-center flex flex-wrap w-full"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center w-full">
                {hotelImages[offer.hotel.hotelId] &&
                hotelImages[offer.hotel.hotelId].length > 0 ? (
                  <div className="flex gap-2  relative overflow-y-hidden overflow-x-hidden rounded-[10px] w-[90px] h-[90px] lg:w-[135px] lg:h-[135px]">
                    {hotelImages[offer.hotel.hotelId].map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        alt={`Hotel ${offer.hotel.name} image ${index + 1}`}
                        className={` ${
                          index === 0
                            ? "w-90 h-90 w-135 h-135 object-cover"
                            : "hidden"
                        }`}
                      />
                    ))}
                  </div>
                ) : (
                  <p>No images available for this hotel.</p>
                )}
                <p className="font-normal items-center justify-center text-center">
                  {offer.hotel.name}
                </p>
                {offer.available && offer.offers ? (
                  offer.offers.map((singleOffer) => (
                    <div
                      key={singleOffer.id}
                      className="flex flex-col justify-center items-end text-end"
                    >
                      <p>
                        Price: {singleOffer.price.total}{" "}
                        {singleOffer.price.currency}
                      </p>
                      <p>Rating: ⭐4.8</p>
                    </div>
                  ))
                ) : (
                  <p>No offers available for this hotel.</p>
                )}
              </div>

              {hotelRatings
                .filter((rating) => rating.hotelId === offer.hotel.hotelId)
                .map((rating) => (
                  <div
                    key={rating.hotelId}
                    className="p-2 mt-2 border border-gray-200"
                  >
                    <h3 className="font-semibold">
                      Rating: {rating.overallRating}%
                    </h3>
                  </div>
                ))}
            </div>
          ))}
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
