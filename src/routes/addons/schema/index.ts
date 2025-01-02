import { z } from 'zod';

export const AddonSchema = z.object({
  name: z.string().min(2, { message: 'Addon name must be at least 2 characters' }),
  description: z.string().optional(),
  price: z.string().min(0, { message: 'Base rate must be non-negative' }),
});

export type AddonFormData = z.infer<typeof AddonSchema>;
