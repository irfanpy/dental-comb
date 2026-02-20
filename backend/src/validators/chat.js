import { z } from "zod";

export const chatSchema = z.object({
  patientId: z.string().uuid(),
  message: z.string().min(1),
});
