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

interface HotelCardProps {
  offer: HotelOffer;
  image: string;
  rating?: number;
  featured: boolean;
}

const HotelCard: React.FC<HotelCardProps> = ({
  offer,
  image,
  rating,
  featured,
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
              <p className="text-xs font-light">{offer.hotel.name}</p>
              <div className="text-xs font-light">
                {offer.offers && offer.offers.length > 0 ? (
                  offer.offers.map((singleOffer) => (
                    <div key={singleOffer.id}>
                      <p>
                        Price: {singleOffer.price.total}{" "}
                        {singleOffer.price.currency}
                      </p>
                      <div className="flex items-center">
                        <h3 className="font-semibold">
                          Rating: ⭐{rating ?? "N/A"}
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
      <div className="flex flex-wrap items-center justify-between w-full">
        <div className="grid items-center w-full grid-cols-1 gap-4 lg:grid-cols-3">
          {image ? (
            <div className="relative overflow-hidden rounded-[10px] w-[90px] h-[90px] lg:w-[135px] lg:h-[135px]">
              <img
                src={image}
                alt={`Hotel ${offer.hotel.name}`}
                className="object-cover w-full h-full"
              />
            </div>
          ) : (
            <p>No image available for this hotel.</p>
          )}
          <p className="items-center justify-center font-normal text-center">
            {offer.hotel.name}
          </p>
          {offer.offers && offer.offers.length > 0 ? (
            offer.offers.map((singleOffer) => (
              <div
                key={singleOffer.id}
                className="flex flex-col items-end justify-center text-end"
              >
                <p>
                  Price: {singleOffer.price.total} {singleOffer.price.currency}
                </p>
                <p>Rating: ⭐{rating ?? "N/A"}</p>
              </div>
            ))
          ) : (
            <p>No offers available for this hotel.</p>
          )}
        </div>
      </div>
    );
  }
};

export default HotelCard;
