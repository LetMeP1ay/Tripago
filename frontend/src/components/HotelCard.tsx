import React from "react";
import { FaStar } from "react-icons/fa";

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

interface HotelCardProps {
  offer: HotelOffer;
  image: string;
  rating?: number;
  streetAddress: string;
  featured: boolean;
}

const HotelCard: React.FC<HotelCardProps> = ({
  offer,
  image,
  rating,
  featured,
  streetAddress,
}) => {
  if (featured) {
    return (
      <div className="w-[272px] h-[150px] relative overflow-hidden rounded-[10px]">
        {image ? (
          <div className="h-full">
            <img
              src={image}
              alt={`Hotel ${offer.hotel.name}`}
              className="w-full h-full object-cover rounded-[10px]"
            />
            <div className="absolute inset-0 flex flex-col justify-between px-[15px] py-2 text-white bg-black bg-opacity-50 rounded-[10px]">
              <div className="text-sm w-full h-full">
                {offer.offers && offer.offers.length > 0 ? (
                  offer.offers.map((singleOffer) => (
                    <div
                      key={singleOffer.id}
                      className="flex justify-between items-end w-full h-full"
                    >
                      <div>
                        <p className="pb-2">{offer.hotel.name}</p>
                        <p>
                          {singleOffer.price.total} {singleOffer.price.currency}
                        </p>
                      </div>
                      <div>
                        <h3 className="flex flex-row items-center">
                          <FaStar className="text-yellow-400 mr-2" />
                          {rating ?? "Unknown"}
                        </h3>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No offers available for this hotel.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p>No image available for this hotel.</p>
        )}
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          {image ? (
            <div className="relative overflow-hidden rounded-[10px] w-[142px] h-[107px] md:w-[221px] md:h-[167px] flex-shrink-0">
              <img
                src={image}
                alt={`Hotel ${offer.hotel.name}`}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <p>No image available for this hotel.</p>
          )}
          <div className="ml-4 flex flex-col">
            <p className="font-bold text-sm md:text-base lg:text-lg">
              {offer.hotel.name}
            </p>
            <p className="text-xs md:text-sm opacity-50">
              {streetAddress}
            </p>
          </div>
        </div>
        {offer.offers && offer.offers.length > 0 ? (
          offer.offers.map((singleOffer) => (
            <div
              key={singleOffer.id}
              className="flex flex-col items-end justify-center text-end ml-4 flex-shrink-0"
            >
              <p className="font-bold">
                {singleOffer.price.total} {singleOffer.price.currency}
              </p>
              <h3 className="flex flex-row items-center">
                <FaStar className="text-yellow-400 mr-2" />
                {rating ?? "Unknown"}
              </h3>
            </div>
          ))
        ) : (
          <p>No offers available for this hotel.</p>
        )}
      </div>
    );
  }
};

export default HotelCard;
