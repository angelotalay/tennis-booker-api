import ClubRepo from "@/repos/ClubRepo.js";
import type {
  GetClubResponseDTO,
  GetClubsResponseDTO,
} from "../dto/ClubDTO.js";

import type { GetClub, GetClubParams, GetClubs } from "@/types/ClubTypes.js";
import type { GetCourt } from "@/types/CourtTypes.js";

/******************************************************************************
 Functions
 ******************************************************************************/

/** ----- DTO Mapping ----- **/
export function toGetClubsResponseDTO(row: GetClubs): GetClubsResponseDTO {
  return {
    id: row.id,
    name: row.name,
    address: {
      id: row.address.id,
      streetNumber: row.address.streetNumber,
      streetName: row.address.streetName,
      postCode: row.address.postCode,
    },
  };
}

export function toGetClubResponseDTO(club: GetClub): GetClubResponseDTO {
  return {
    id: club.id,
    name: club.name,
    address: {
      id: club.address.id,
      streetNumber: club.address.streetNumber,
      streetName: club.address.streetName,
      postCode: club.address.postCode,
    },
    courts: club.courts.map((court: GetCourt) => {
      return {
        id: court.id,
        name: court.name,
        indoor: court.indoor,
      };
    }),
  };
}

/**
 * Get all clubs
 */
async function getAllClubs(): Promise<GetClubsResponseDTO[]> {
  // Should return an array of clubs, extracting the appropriate data
  const allClubs = await ClubRepo.getAll();
  return allClubs.map(toGetClubsResponseDTO);
}

/**
 * Get one club using the id
 */
async function getClub(dto: GetClubParams): Promise<GetClubResponseDTO | null> {
  const club = await ClubRepo.getOne({ ...dto });
  if (!club) {
    return null;
  }
  return toGetClubResponseDTO(club);
}

export default {
  getAllClubs,
  getClub,
} as const;
