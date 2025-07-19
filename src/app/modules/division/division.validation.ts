import z from "zod";

export const createDivisionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});

export const updateDivisionSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
});
