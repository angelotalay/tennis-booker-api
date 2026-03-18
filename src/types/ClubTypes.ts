import { Prisma } from "@/generated/prisma/client.js";
import { z } from "zod";
import ClubSchema from "@/src/validation/ClubSchema.js";

/******************************************************************************
 Types
 ******************************************************************************/

// ----------------------- Prisma return types --------------------------------- //
export type GetClubs = Prisma.ClubGetPayload<{
  select: {
    id: true;
    name: true;
    address: {
      select: {
        id: true;
        streetNumber: true;
        streetName: true;
        postCode: true;
      };
    };
  };
}>;

export type GetClub = Prisma.ClubGetPayload<{
  include: {
    address: true;
    courts: true;
  };
}>;

// ----------------------- Request types --------------------------------- //
export type GetClubParams = z.infer<typeof ClubSchema.clubParamsSchema>;

// ----------------------- DTO types --------------------------------- //
