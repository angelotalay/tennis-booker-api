import { Prisma } from "../../generated/prisma/client.js";

/******************************************************************************
 Types
 ******************************************************************************/
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
