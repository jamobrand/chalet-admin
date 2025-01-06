import { createContext } from 'react';
import { ChaletContextType, ChaletListingData } from './chalet-context-types';
import { PropertyType } from './types';

export const initialChaletData: Partial<ChaletListingData> = {
  chaletDetails: {
    name: '',
    type: PropertyType.STANDALONE,  // Set a default enum value instead of empty string
    isEnsuite: false,
    basePrice: 0,
    roomCount: 1,
    totalWashrooms: 0, // Added when isEnsuite is false
    totalFloors: 0,
    hasUpstairsLounge: false,
    hasDownstairsLounge: false,
    maxAdults: 0,
    maxChildren: 0,
    totalSleeps: 0,
    ownerId: '',
  },
  images: [],
  roomDetails: [],
  availability: {
    unavailableDates: []
  },
  amenities: {
    predefinedAmenities: [],
    customAmenities: [],
  },
  location: {
    name: "",
    address: "",
    coordinates: {
      lat: 0,
      lng: 0,
    },
  },
};

export const ChaletContext = createContext<ChaletContextType | undefined>(undefined);
