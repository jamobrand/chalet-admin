import { z } from 'zod';

export const ChaletDetailsSchema = z.object({
  name: z.string().min(2, { message: 'Chalet name must be at least 2 characters' }),
  type: z.enum(['Duplex Lower', 'Stand Alone Unit', 'Duplex Upper']),
  description: z.string().optional(),
  basePrice: z.number().min(0, { message: 'Base rate must be non-negative' }),
  roomCount: z.number().min(1, { message: 'Maximum occupancy must be at least 1' }),
  isEnsuite: z.boolean(),
});

export const RoomDetailsSchema = z.object({
  roomType: z.enum(['Double', 'Twin'], {
    required_error: 'Room type is required',
  }),
  room: z.number().min(1, { message: 'At least 1 room is required' }),
  capacity: z.number().min(1, { message: 'Capacity must be at least 1' }),
});

export const AvailabilitySchema = z.object({
  unavailableDates: z.array(z.date()).optional(),
});

export type AvailabilityFormData = z.infer<typeof AvailabilitySchema>;

export const LocationSchema = z.object({
  location: z.object({
    name: z.string().min(1, "Location name is required"),
    address: z.string().min(1, "Address is required"),
    coordinates: z.object({
      lat: z.number().min(-90).max(90),
      lng: z.number().min(-180).max(180)
    })
  })
});

export type LocationFormData = z.infer<typeof LocationSchema>;

export const AmenitiesSchema = z.object({
  predefinedAmenities: z.array(z.string()).optional(),
  customAmenities: z.array(
    z.object({
      name: z.string().min(1, "Custom amenity name is required"),
    })
  ).optional(),
});

// Type for the form schema
export type AmenitiesFormData = z.infer<typeof AmenitiesSchema>;

export const ChaletImageSchema = z.object({
  file: z.instanceof(File).nullable(),
  url: z.string(),
  alt: z.string(),
  key: z.string().optional(),
  label: z.string(),
  isMain: z.boolean()
});

export const ChaletImagesSchema = z
  .object({
    images: z
      .array(ChaletImageSchema)
      .min(1, { message: "At least one image is required" }),
  })

export type ChaletImagesData = z.infer<typeof ChaletImagesSchema>;