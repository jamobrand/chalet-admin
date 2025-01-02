import { z } from 'zod';

export const RuleSchema = z.object({
  title: z.string().min(2, { message: 'Rule title must be at least 2 characters' }),
  description: z.string().optional(),
});

export type RuleFormData = z.infer<typeof RuleSchema>;
