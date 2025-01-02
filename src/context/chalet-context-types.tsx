import { AmenitiesData, AvailabilityData, ChaletDetailsData, ChaletImage, LocationData, RoomData } from "./types";

// Complete Chalet Listing Data
export interface ChaletListingData {
  chaletDetails: ChaletDetailsData;
  roomDetails: RoomData[];
  availability: AvailabilityData;
  location:LocationData;
  images: ChaletImage[];
  amenities?: AmenitiesData;
}

// Context Types
export interface ChaletContextType {
  chaletData: Partial<ChaletListingData>;
  updateChaletData: <K extends keyof ChaletListingData>(
    key: K,
    value: ChaletListingData[K]
  ) => void;
  resetChaletData: () => void;
}
