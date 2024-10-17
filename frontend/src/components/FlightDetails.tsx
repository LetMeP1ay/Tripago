import React, { useState } from "react";
import AirlineLogo from "./AirlineLogo";

interface FlightSegment {
  departure: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  arrival: {
    iataCode: string;
    terminal?: string;
    at: string;
  };
  carrierCode: string;
  number: string;
  aircraft: {
    code: string;
  };
  duration: string;
  numberOfStops: number;
}

interface FlightOffer {
  itineraries: Array<{
    segments: FlightSegment[];
    duration: string;
  }>;
  price: {
    total: string;
    currency: string;
  };
  validatingAirlineCodes: string[];
}

interface FlightDetailsProps {
  flight: FlightOffer;
  carriers: Record<string, string>;
  aircraft: Record<string, string>;
}

const toTitleCase = (text: string) => {
  return text
    ?.toLowerCase()
    ?.split(" ")
    ?.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    ?.join(" ");
};

export const FlightDetails: React.FC<FlightDetailsProps> = ({
  flight,
  carriers,
  aircraft,
}) => {
  const formatDuration = (duration: string) => {
    const hoursMatch = duration.match(/(\d+)H/);
    const minutesMatch = duration.match(/(\d+)M/);

    const hours = hoursMatch ? `${hoursMatch[1]} h` : "";
    const minutes = minutesMatch ? `${minutesMatch[1]} m` : "";

    return `${hours} ${minutes}`.trim();
  };

  const firstCarrierCode = flight.itineraries[0].segments[0].carrierCode;
  const secondCarrierCode =
    flight.itineraries.length > 1
      ? flight.itineraries[1].segments[0].carrierCode
      : null;

  const sameAirline = secondCarrierCode === firstCarrierCode;

  return (
    <div className="flex flex-col p-4 border border-gray-300 w-full rounded-lg mb-2 shadow-lg max-w-[1200px]">
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
          <p className="text-xl font-bold">
            {flight.price.currency} {flight.price.total}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;
