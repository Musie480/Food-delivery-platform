import { z } from "zod";

export const createAddressSchema = z.object({
  title: z.enum(["Home", "Work", "Other"]).default("Other"),
  label: z.string().max(50).optional(),
  address: z.string().min(3).max(300),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  isDefault: z.boolean().optional(),
});

export const updateAddressSchema = z.object({
  title: z.enum(["Home", "Work", "Other"]).optional(),
  label: z.string().max(50).optional(),
  address: z.string().min(3).max(300).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
  isDefault: z.boolean().optional(),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
