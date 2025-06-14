import { z } from "zod";

export const gistSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Title must not be blank",
    })
    .max(100, {
      message: "Title must not be longer than 100 characters",
    }),
  description: z.string().min(1, {
    message: "Description must not be blank",
  }),
  from: z.date({
    required_error: "From date is required",
  }),
  to: z.date({
    required_error: "To date is required",
  }),
  author: z.string().uuid().optional(),
});
