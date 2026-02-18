import { prisma } from "../lib/client.js";
import type { GetClubs, GetClub } from "../types/Club.js";

/******************************************************************************
Functions
 ******************************************************************************/

/**
 * Get one club
 */
async function getOne(name: string): Promise<GetClub | null> {
  return prisma.club.findUnique({
    where: { name },
    include: {
      address: true,
      Court: true,
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
