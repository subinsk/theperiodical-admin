import { z } from "zod";

export const topicSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Title must not be blank",
    })
    .max(100, {
      message: "Title must not be longer than 100 characters",
    }),
  content: z.string().min(1, {
    message: "Content must not be blank",
  }),
});
