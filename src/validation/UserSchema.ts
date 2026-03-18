import * as z from "zod";

const userParamsSchema = z.object({
  id: z.coerce
    .number()
    .int({ error: ":id needs to be an integer" })
    .positive({ error: ":id needs to be a positive integer" }),
});

export default { userParamsSchema } as const;
