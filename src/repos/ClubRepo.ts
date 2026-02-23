import { prisma } from "../lib/client.js";
import type { GetClubs, GetClub } from "../types/ClubTypes.js";

/******************************************************************************
Functions
 ******************************************************************************/

/**
 * Get one club
 */
async function getOne({ id }: { id: number }): Promise<GetClub | null> {
  return prisma.club.findUnique({
    where: { id },
    include: {
      address: true,
      courts: true,
    },
  });
}

/**
 * Get all clubs
 */
async function getAll(): Promise<GetClubs[]> {
  return prisma.club.findMany({
    select: {
      id: true,
      name: true,
      address: {
        select: {
          id: true,
          streetNumber: true,
          streetName: true,
          postCode: true,
        },
      },
    },
    orderBy: {
      id: "asc",
    },
  });
}

export default {
  getOne,
  getAll,
} as const;
