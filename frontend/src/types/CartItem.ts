export interface CartItem {
  id: string;
  type: "flight" | "hotel";
  flight?: FlightItem;
  hotel?: HotelItem;
}

export interface FlightItem {
  flightData: FlightData;
  carriers: Record<string, string>;
  aircraft: Record<string, string>;
}

interface FlightData {
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

export interface HotelItem {
  offer: HotelOffer;
  image: string;
  rating?: number;
  streetAddress: string;
  featured: boolean;
}

export interface HotelOffer {
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
