import { prisma } from "../lib/client.js";
import type { GetCourt, GetCourts } from "../types/CourtTypes.js";
import type { GetCourtsRequestDTO } from "../dto/CourtDTO.js";

/******************************************************************************
 Functions
 ******************************************************************************/

/**
 * Get all courts for all clubs or all courts for a particular club by parsing in the clubID
 * @param dto - Data transfer object that can contains the id of a particular club
 */
async function getAll(dto: GetCourtsRequestDTO): Promise<GetCourts[]> {
  return prisma.court.findMany({
    where: dto.clubId ? { clubId: dto.clubId } : {},
    select: {
      id: true,
      name: true,
      indoor: true,
      surface: true,
      clubId: true,
    },
  });
}

/**
 * Get one court using id
 */
async function getOne({ id }: { id: number }): Promise<GetCourt | null> {
  return prisma.court.findUnique({
    where: { id },
    include: { club: true },
  });
}

/******************************************************************************
Exports
 ******************************************************************************/

export default {
  getOne,
  getAll,
} as const;
