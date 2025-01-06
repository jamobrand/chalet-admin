// Enhanced type to include label and isMain flag
export interface ChaletImage {
  file: File | null;
  url: string;
  alt: string;
  key?: string;
  label: string;
  isMain: boolean;
}

// Add PropertyType enum to match Prisma
export enum PropertyType {
  STANDALONE = "STANDALONE",
  DUPLEX_UPPER = "DUPLEX_UPPER",
  DUPLEX_LOWER = "DUPLEX_LOWER"
}

export interface ChaletDetailsData {
  name: string;
  type: PropertyType; // Using the enum from Prisma
  description?: string;
  basePrice: number;
  weekendPrice?: number;
  isEnsuite: boolean;
  roomCount: number;
  totalWashrooms: number; // Added when isEnsuite is false
  totalFloors: number;
  hasUpstairsLounge: boolean;
  hasDownstairsLounge: boolean;
  maxAdults: number;
  maxChildren: number;
  totalSleeps: number;
  ownerId: string;
}

export interface ChaletImagessData {
  images: ChaletImage[];
}

export enum RoomType {
  Double = "Double",
  Twin = "Twin"
}

export interface RoomData {
  roomType: RoomType;
  floor: number;
  notEnsuite: boolean;
  hasBunkBed: boolean;
  bunkBedCapacity?: number;
  capacity: number;
  numberOfRooms: number; // Number of rooms of this type
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

