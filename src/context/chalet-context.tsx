import { createContext } from 'react';
import { ChaletContextType, ChaletListingData } from './chalet-context-types';

export const initialChaletData: Partial<ChaletListingData> = {
  chaletDetails: {
    name: '',
    type: '',
    isEnsuite: false,
    basePrice: 0,
    roomCount: 1,
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
