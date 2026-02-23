import * as z from "zod";

// In the future, maybe we standardise error message and keep them in a separate file
const clubParamsSchema = z.object({
  id: z.coerce
    .number()
    .int({ error: ":id needs to be an integer" })
    .positive({ error: ":id needs to be a positive integer" }),
});

export default {
  clubParamsSchema,
} as const;
