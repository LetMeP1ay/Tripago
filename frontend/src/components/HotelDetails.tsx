import React, { useState } from "react";

interface Hotel {
idataCode: string;
name: string;
dupeId: string;
hotelId: string;
geoCode: {
    lat:string;
    lon:string;
}
address: {
    countryCode: string;
}
}

interface HotelDetailsProps {
    hotel: Hotel;
}

const toTitleCase = (text: string) => {
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  export const HotelDetails: React.FC<HotelDetailsProps> = ({
    hotel
  }) => {

  const [query, setQuery] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Hotel[]>([]);
  const [selectedAirport, setSelectedAirport] = useState<Hotel | null>(null);
  const [isEditable, setIsEditable] = useState<boolean>(false);

    const name = hotel.name;
    const HotelId = hotel.hotelId;
    const geoLat = hotel.geoCode.lat;
    const geoLon = hotel.geoCode.lon;
    const address = hotel.address.countryCode;

    const fetchHotelData = async (searchText: string) => {
        if (!searchText) {
            setSuggestions([]);
            return;
        }
    
        try {
            const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/hotel-suggestions?keyword=${searchText}`
            );
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error("Error fetching hotel suggestions:", error);
        }
        }
  
    return (
      <div className="flex flex-col p-4 border border-gray-300 w-full rounded-lg mb-4 shadow-lg max-w-[1200px]">
        <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
          <div className="flex flex-col text-sm font-semibold w-[140px] hidden lg:flex">
            <div className="flex items-center">
              <AirlineLogo airlineName={carriers[firstCarrierCode]} />
              <span className="pl-3 w-1/4">
                {toTitleCase(carriers[firstCarrierCode])}
              </span>
            </div>
  
            {!sameAirline && secondCarrierCode && (
              <div className="flex items-center mt-4">
                <AirlineLogo airlineName={carriers[secondCarrierCode]} />
                <span className="pl-3">
                  {toTitleCase(carriers[secondCarrierCode])}
                </span>
              </div>
            )}
          </div>
  
          <div className="flex flex-col w-full lg:w-auto">
            {flight.itineraries.map((itinerary, itineraryIndex) => {
              const segments = itinerary.segments;
              const firstSegment = segments[0];
              const lastSegment = segments[segments.length - 1];
  
              return (
                <div key={itineraryIndex} className="mb-3">
                  {(itineraryIndex === 0 || !sameAirline) && (
                    <div className="block lg:hidden mb-2 flex justify-center items-center">
                      <AirlineLogo
                        airlineName={carriers[firstSegment.carrierCode]}
                      />
                      <span className="pl-3 font-semibold">
                        {toTitleCase(carriers[firstSegment.carrierCode])}
                      </span>
                    </div>
                  )}
  
                  <div className="flex flex-col font-bold sm:flex-row justify-between items-center">
                    <div className="flex flex-col w-full sm:w-[200px] flex-shrink-0 items-center">
                      {new Date(firstSegment.departure.at).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                      <span className="text-gray-500 font-medium text-xs">
                        {firstSegment.departure.iataCode}
                      </span>
                    </div>
  
                    <div className="flex flex-col w-full sm:w-[300px] items-center text-center sm:text-left">
                      <span className="text-gray-500 text-xs">
                        {formatDuration(itinerary.duration)}
                      </span>
                      <div className="relative flex py-5 w-full items-center">
                        <div className="flex-grow border-t border-gray-400 relative">
                          {segments.length > 1 && (
                            <div className="absolute left-1/2 transform -translate-x-1/2 bg-gray-500 w-4 h-4 rounded-full top-[-8px]"></div>
                          )}
                        </div>
                      </div>
                      {segments.length === 2 ? (
                        <div className="text-sm text-gray-500">
                          {segments[0].arrival.iataCode}
                        </div>
                      ) : segments.length > 2 ? (
                        <div className="text-sm text-gray-500">
                          {segments.length - 1} stops
                        </div>
                      ) : (
                        <div className="text-sm font-semibold">Direct</div>
                      )}
                    </div>
  
                    <div className="flex flex-col font-bold w-full sm:w-[200px] flex-shrink-0 items-center">
                      {new Date(lastSegment.arrival.at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      <span className="text-gray-500 font-medium text-xs">
                        {lastSegment.arrival.iataCode}
                      </span>
                    </div>
                  </div>
  
                  {itineraryIndex < flight.itineraries.length - 1 && (
                    <hr className="border-gray-300 my-4 sm:block lg:hidden" />
                  )}
                </div>
              );
            })}
          </div>
  
          <div className="flex items-center justify-center w-full lg:w-auto">
            <p className="text-xl font-bold">$ {flight.price.total}</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default HotelDetails;
