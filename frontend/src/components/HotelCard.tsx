import React from "react";

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

interface HotelCardProps {
  offer: HotelOffer;
  images: string[];
  rating?: HotelRating;
  featured: boolean;
}

const HotelCard: React.FC<HotelCardProps> = ({
  offer,
  images,
  rating,
  featured,
}) => {
  if (featured) {
    return (
      <div className="w-[272px] h-[150px] relative overflow-hidden rounded-[10px]">
        {images && images.length > 0 ? (
          <div className="flex flex-wrap gap-2 h-full">
            {images.map((imageUrl, index) => (
              <img
                key={index}
                src={imageUrl}
                alt={`Hotel ${offer.hotel.name} image ${index + 1}`}
                className={`${
                  index === 0
                    ? "w-full h-full object-cover rounded-[10px]"
                    : "hidden"
                }`}
              />
            ))}
            <div className="absolute inset-0 flex flex-col justify-between px-[15px] py-2 text-white bg-black bg-opacity-50 rounded-[10px]">
              <p className="text-xs font-light">{offer.hotel.name}</p>
              <div className="text-xs font-light">
                {offer.available && offer.offers ? (
                  offer.offers.map((singleOffer) => (
                    <div key={singleOffer.id}>
                      <p>
                        Price: {singleOffer.price.total}{" "}
                        {singleOffer.price.currency}
                      </p>
                      <div className="flex items-center">
                        <h3 className="font-semibold">
                          Rating: ⭐{rating?.overallRating ?? "N/A"}
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
          <p>No images available for this hotel.</p>
        )}
      </div>
    );
  } else {
    return (
      <div className="flex flex-wrap items-center justify-between w-full">
        <div className="grid items-center w-full grid-cols-1 gap-4 lg:grid-cols-3">
          {images && images.length > 0 ? (
            <div className="relative flex gap-2 overflow-hidden rounded-[10px] w-[90px] h-[90px] lg:w-[135px] lg:h-[135px]">
              {images.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`Hotel ${offer.hotel.name} image ${index + 1}`}
                  className={`${
                    index === 0 ? "object-cover w-full h-full" : "hidden"
                  }`}
                />
              ))}
            </div>
          ) : (
            <p>No images available for this hotel.</p>
          )}
          <p className="items-center justify-center font-normal text-center">
            {offer.hotel.name}
          </p>
          {offer.available && offer.offers ? (
            offer.offers.map((singleOffer) => (
              <div
                key={singleOffer.id}
                className="flex flex-col items-end justify-center text-end"
              >
                <p>
                  Price: {singleOffer.price.total} {singleOffer.price.currency}
                </p>
                <p>Rating: ⭐{rating?.overallRating ?? "N/A"}</p>
              </div>
            ))
          ) : (
            <p>No offers available for this hotel.</p>
          )}
        </div>

        {rating && (
          <div className="p-2 mt-2 border border-gray-200">
            <h3 className="font-semibold">Rating: {rating.overallRating}%</h3>
          </div>
        )}
      </div>
    );
  }
};

export default HotelCard;
