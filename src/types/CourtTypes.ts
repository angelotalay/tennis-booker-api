import * as z from "zod";

import { Prisma } from "../../generated/prisma/client.js";
import CourtSchemas from "@/src/validation/CourtSchema.js";

/******************************************************************************
 Types
 ******************************************************************************/

// ----------------------- Prisma return types --------------------------------- //
export type GetCourt = Prisma.CourtGetPayload<{
  include: {
    club: true;
  };
}>;

export type GetCourts = Prisma.CourtGetPayload<{
  select: {
    id: true;
    name: true;
    indoor: true;
    surface: true;
    clubId: true;
  };
}>;

// ----------------------- Request types --------------------------------- //
export type GetCourtsQuery = z.infer<typeof CourtSchemas.courtsQuerySchema>;
export type GetCourtParams = z.infer<typeof CourtSchemas.courtParamsSchema>;
