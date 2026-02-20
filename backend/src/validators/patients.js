import { z } from "zod";

export const patientCreateSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  dob: z.string().optional().nullable(),
  medicalNotes: z.string().optional().nullable(),
});

export const patientUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  dob: z.string().optional().nullable(),
  medicalNotes: z.string().optional().nullable(),
});
