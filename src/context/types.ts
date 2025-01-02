// Enhanced type to include label and isMain flag
export interface ChaletImage {
  file: File | null;
  url: string;
  alt: string;
  key?: string;
  label: string;
  isMain: boolean;
}

export interface ChaletDetailsData {
  name: string;
  type: string;
  description?: string;
  basePrice: number;
  isEnsuite: boolean;
  roomCount: number;
}

export interface ChaletImagessData {
  images: ChaletImage[];
}

export interface RoomData {
  roomType: string | undefined;
  room: number;
  capacity: number;
}

export interface AvailabilityData {
  unavailableDates: Date[];
}

export interface LocationData {
  id?:string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface AmenitiesData {
  predefinedAmenities: string[];
  customAmenities: { name: string }[];
}

