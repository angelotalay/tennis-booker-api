import { Prisma } from "../../generated/prisma/client.js";

/******************************************************************************
 Types
 ******************************************************************************/
export type Clubs = Prisma.ClubGetPayload<{
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

export type Club = Prisma.ClubGetPayload<{
  include: {
    address: true;
    Court: true;
  };
}>;
