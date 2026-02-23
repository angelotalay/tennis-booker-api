import { Prisma } from "../../generated/prisma/client.js";

/******************************************************************************
 Types
 ******************************************************************************/
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
