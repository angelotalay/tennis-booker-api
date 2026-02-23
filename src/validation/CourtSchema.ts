import * as z from "zod";

const courtParamsSchema = z.object({
  courtId: z.coerce
    .number()
    .int({ error: ":id needs to be an integer" })
    .positive({ error: ":id needs to be a positive integer" }),
});

export const courtsQuerySchema = z.object({
  clubId: z.coerce
    .number({ error: "id needs to be an integer" })
    .int({ error: ":id needs to be an integer" })
    .positive({ error: "id needs to be a positive integer" })
    .optional(),
});

export default { courtParamsSchema, courtsQuerySchema } as const;
