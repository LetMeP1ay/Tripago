"use client";

import {
  ChangeEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import HotelButton from "@/components/HotelButton";
import HotelCard from "@/components/HotelCard";
import HotelSearchBar from "@/components/HotelSearchBar";
import { VscSettings } from "react-icons/vsc";
import { CartItem } from "@/types";
import { AuthContext } from "@/context/AuthContext";
import { CartContext } from "@/context/CartContext";
import NotificationPopup from "@/components/NotificationPopup";

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

  const hotelOffersRef = useRef<HotelOffer[]>([]);
  const hotelDataRef = useRef<Record<string, HotelData>>({});
  const [selectedFilter, setSelectedFilter] = useState<string>("Hotel");
  const [additionalQueryParams, setAdditionalQueryParams] = useState<
    Record<string, string>
  >({});
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const [hotelOffers, setHotelOffers] = useState<HotelOffer[]>([]);
  const [addressInput, setAddressInput] = useState<string>("");
  const [hotelData, setHotelData] = useState<Record<string, HotelData>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [allHotelIds, setAllHotelIds] = useState<string[]>([]);
  const [currentBatch, setCurrentBatch] = useState<number>(0);
  const [countryCode, setCountryCode] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("price");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] =
    useState<boolean>(false);
  const [showNotification, setShowNotification] = useState(false);

  const numFeatured = 3;
  const nonFeaturedOffers = hotelOffers.slice(numFeatured);
  const query = useSearchParams();
  const cityCode = query.get("cityCode") || "";
  const checkInDate = query.get("checkInDate") || "";
  const checkOutDate = query.get("checkOutDate") || "";
  const adults = query.get("adults") || "1";

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
    setIsFilterDropdownOpen(false);
  };

  const handleAddToCart = (
    offer: HotelOffer,
    image: string,
    streetAddress: string,
    featured: boolean,
    rating?: number
  ) => {
    if (!user) {
      alert("Please log in to add items to your cart.");
      return;
    }

    const cartItem: CartItem = {
      id: offer.hotel.hotelId,
      type: "hotel",
      hotel: {
        offer,
        image,
        streetAddress,
        featured,
        rating,
      },
    };

    addToCart(cartItem);
    setShowNotification(true);
  };

  const handleFilterClick = (filterLabel: string) => {
    setSelectedFilter(filterLabel);

    let queryParams: Record<string, string> = {};

    switch (filterLabel) {
      case "Hotel":
        queryParams = { bestRateOnly: "true" };
        break;
      case "Apartments":
        queryParams = { roomQuantity: "1", priceRange: "50-150" };
        break;
      case "Condo":
        queryParams = { roomQuantity: "2", priceRange: "150-300" };
        break;
      case "Mansion":
        queryParams = { roomQuantity: "3", priceRange: "300-1000" };
        break;
      default:
        queryParams = {};
    }

    setAdditionalQueryParams(queryParams);

    setHotelOffers([]);
    setHotelData({});
    setCurrentBatch(0);
    hotelOffersRef.current = [];
    hotelDataRef.current = {};

    fetchOffersWithFilters(queryParams);
  };

  const fetchOffersWithFilters = async (
    extraParams: Record<string, string>
  ) => {
    const hotelIds = await fetchHotelsByCity();
    setAllHotelIds(hotelIds);
    setCurrentBatch(0);

    let batchNumber = 0;
    const totalBatches = Math.ceil(hotelIds?.length / BATCH_SIZE);

    while (
      batchNumber < totalBatches &&
      (!hasEnoughFeatured() || !hasEnoughNonFeatured())
    ) {
      const startIndex = batchNumber * BATCH_SIZE;
      const endIndex = startIndex + BATCH_SIZE;
      const batchHotelIds = hotelIds?.slice(startIndex, endIndex);

      await fetchHotelOffers(batchHotelIds, extraParams);
      setCurrentBatch((prevBatch) => prevBatch + 1);

      batchNumber++;
    }
  };

  const sortByDisplayName = (sortOption: string) => {
    switch (sortOption) {
      case "price":
        return "Price";
      case "rating":
        return "Rating";
      case "name":
        return "Name (A-Z)";
      case "name_desc":
        return "Name (Z-A)";
      default:
        return "Select";
    }
  };

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

  const fetchHotelOffers = async (
    hotelIds: string[],
    extraParams: Record<string, string>
  ) => {
    if ((!cityCode && hotelIds?.length === 0) || !checkInDate) {
      setError("Missing city code, dates, or hotel IDs.");
      return;
    }

    setLoading(true);
    setError(null);

    const hotelIdsParam = hotelIds?.join(",");

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

        setHotelOffers((prevOffers) => {
          const newOffers = [...prevOffers, ...availableOffers];
          hotelOffersRef.current = newOffers;
          return newOffers;
        });

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
      await fetchHotelOffers(batch, additionalQueryParams);
      setCurrentBatch(currentBatch + 1);
    }
  };

  const sortedNonFeaturedOffers = useMemo(() => {
    const offers = [...nonFeaturedOffers];

    offers.sort((a, b) => {
      const hotelDataA = hotelData[a.hotel.hotelId] || {};
      const hotelDataB = hotelData[b.hotel.hotelId] || {};

      const ratingA = hotelDataA.rating || 0;
      const ratingB = hotelDataB.rating || 0;

      const nameA = a.hotel.name.toLowerCase();
      const nameB = b.hotel.name.toLowerCase();

      const priceA =
        a.offers && a.offers[0]?.price?.total
          ? parseFloat(a.offers[0].price.total)
          : Infinity;
      const priceB =
        b.offers && b.offers[0]?.price?.total
          ? parseFloat(b.offers[0].price.total)
          : Infinity;

      switch (sortBy) {
        case "price":
          return priceA - priceB;
        case "rating":
          return ratingB - ratingA;
        case "name":
          return nameA.localeCompare(nameB);
        case "name_desc":
          return nameB.localeCompare(nameA);
        default:
          return 0;
      }
    });

    return offers;
  }, [nonFeaturedOffers, hotelData, sortBy]);

  const filteredNonFeaturedOffers = useMemo(() => {
    return sortedNonFeaturedOffers.filter((offer) => {
      const hotelId = offer.hotel.hotelId;
      const data = hotelData[hotelId];

      if (!data || !data.streetAddress) {
        return false;
      }

      if (addressInput.trim() === "") {
        return true;
      }

      return data.streetAddress
        .toLowerCase()
        .includes(addressInput.toLowerCase());
    });
  }, [sortedNonFeaturedOffers, hotelData, addressInput]);

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

        setHotelData((prevData) => {
          const newData = {
            ...prevData,
            [hotelId]: {
              image: photoUrl,
              rating: rating,
              streetAddress: streetAddress,
            },
          };
          hotelDataRef.current = newData;
          return newData;
        });
      }
    } catch (error) {
      console.error("Error fetching hotel data:", error);
    }
  };

  const handleHotelSelect = async (hotelIds: string[]) => {
    await fetchHotelOffers(hotelIds, additionalQueryParams);
  };
  const hasEnoughFeatured = () => {
    const availableOffers = hotelOffersRef.current.filter(
      (offer) => offer.available
    );
    return availableOffers.slice(0, numFeatured).length >= numFeatured;
  };

  const hasEnoughNonFeatured = () => {
    const availableOffers = hotelOffersRef.current.filter(
      (offer) => offer.available
    );
    return availableOffers.slice(numFeatured).length >= 4;
  };

  useEffect(() => {
    const fetchOffersInBatches = async () => {
      const hotelIds = await fetchHotelsByCity();
      setAllHotelIds(hotelIds);
      setCurrentBatch(0);

      let batchNumber = 0;
      const totalBatches = Math.ceil(hotelIds?.length / BATCH_SIZE);

      while (
        batchNumber < totalBatches &&
        (!hasEnoughFeatured() || !hasEnoughNonFeatured())
      ) {
        const startIndex = batchNumber * BATCH_SIZE;
        const endIndex = startIndex + BATCH_SIZE;
        const batchHotelIds = hotelIds?.slice(startIndex, endIndex);

        await fetchHotelOffers(batchHotelIds, additionalQueryParams);
        setCurrentBatch((prevBatch) => prevBatch + 1);

        batchNumber++;
      }
    };

    fetchOffersInBatches();
  }, [cityCode, checkInDate, checkOutDate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdownElement = document.getElementById("filter-dropdown");
      if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
        setIsFilterDropdownOpen(false);
      }
    };

    if (isFilterDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilterDropdownOpen]);

  return (
    <div
      className={`flex-col justify-start items-center gap-[15px] inline-flex w-full p-6 ${
        hotelOffers.length > 0 ? "h-auto" : "h-full"
      } bg-white text-black`}
    >
      {hotelOffers.length === 0 && (
        <div className="flex flex-col pt-96 items-center justify-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-black"
            role="status"
          >
            <span className="text-black !absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
          <div className="mt-4 text-center">
            If you see this for too long, make sure that you have selected your
            flight ticket.
          </div>
        </div>
      )}
      {hotelOffers.length > 0 && (
        <>
          <div className="flex justify-between items-center w-full md:text-xl">
            <div>
              <p className="opacity-50">Discover your</p>
              <p className="font-bold">perfect place to stay</p>
            </div>

            <div className="px-[15px] py-2.5 bg-white rounded-[50px] border-2 border-black/10 flex items-center w-1/2">
              <input
                className="text-black/50 text-xs md:text-xl font-bold w-full outline-none"
                placeholder="Search by address"
                value={addressInput}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setAddressInput(e.target.value)
                }
              />
              <Image
                alt="icon"
                src="/Arrow.svg"
                height={20}
                width={20}
                className="h-3 w-3 md:h-5 md:w-5 rotate-90"
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
              {["Hotel", "Apartments", "Condo", "Mansion"].map((label) => (
                <HotelButton
                  key={label}
                  label={label}
                  isActive={selectedFilter === label}
                  onClick={() => handleFilterClick(label)}
                />
              ))}
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
                      <div
                        key={hotelId}
                        className="flex-shrink-0 cursor-pointer"
                        onClick={() =>
                          handleAddToCart(
                            offer,
                            image,
                            streetAddress,
                            false,
                            rating || 0
                          )
                        }
                      >
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
            <div className="relative inline-block text-left">
              <button
                className="relative flex justify-center items-center bg-[#ebebeb]  hover:bg-[#DADADA] active:bg-[#BBB] opacity-50 rounded-[50px] p-3 px-8 transition-all duration-600 ease-in-out"
                onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              >
                <p>Filter: {sortByDisplayName(sortBy)}</p>
                <VscSettings className="rotate-[90deg] h-6 w-6" />
              </button>

              {isFilterDropdownOpen && (
                <div
                  id="filter-dropdown"
                  className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                >
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="options-menu"
                  >
                    <button
                      className={`w-full text-left px-4 py-2 text-sm ${
                        sortBy === "price"
                          ? "bg-gray-200 text-gray-900"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => handleSortChange("price")}
                    >
                      Price
                    </button>
                    <button
                      className={`w-full text-left px-4 py-2 text-sm ${
                        sortBy === "rating"
                          ? "bg-gray-200 text-gray-900"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => handleSortChange("rating")}
                    >
                      Rating
                    </button>
                    <button
                      className={`w-full text-left px-4 py-2 text-sm ${
                        sortBy === "name"
                          ? "bg-gray-200 text-gray-900"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => handleSortChange("name")}
                    >
                      Name (A-Z)
                    </button>
                    <button
                      className={`w-full text-left px-4 py-2 text-sm ${
                        sortBy === "name_desc"
                          ? "bg-gray-200 text-gray-900"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => handleSortChange("name_desc")}
                    >
                      Name (Z-A)
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {filteredNonFeaturedOffers.length > 0 && (
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              {filteredNonFeaturedOffers.map((offer) => {
                const hotelId = offer.hotel.hotelId;
                const data = hotelData[hotelId] || {};
                const image = data.image || "";
                const rating = Number(data.rating) || 0;
                const streetAddress = data.streetAddress || "";

                return (
                  <div key={hotelId}>
                    <HotelCard
                      streetAddress={streetAddress}
                      offer={offer}
                      image={image}
                      rating={rating || 0}
                      featured={false}
                    />
                    <div className="w-full flex justify-end items-center">
                      <button
                        className="w-1/4 rounded-lg bg-[#71D1FC] mb-8 p-3 text-sm font-medium text-white transition-all duration-600 ease-in-out hover:bg-[#5BBEEB] active:bg-[#4DAED3] ml-auto"
                        onClick={() =>
                          handleAddToCart(
                            offer,
                            image,
                            streetAddress,
                            false,
                            rating || 0
                          )
                        }
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {currentBatch * BATCH_SIZE < allHotelIds?.length && (
            <button
              onClick={fetchNextBatch}
              className="bg-[#71D1FC] hover:bg-[#5BBEEB] active:bg-[#5AAEEA] transition-all duration-600 ease-in-out text-white rounded-lg p-2 mb-10"
            >
              Load More Hotels
            </button>
          )}{" "}
          <NotificationPopup
            message="Hotel added to cart successfully!"
            onClose={() => setShowNotification(false)}
            show={showNotification}
          />
        </>
      )}
    </div>
  );
}
