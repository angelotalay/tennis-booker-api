import ClubRepo from "../repos/ClubRepo.js";
import type { GetClubsResponseDTO } from "../dto/ClubDTO.js";

import type { Clubs } from "../types/Club.js";

/******************************************************************************
 Functions
 ******************************************************************************/

/** DTO Mapping **/
function toGetClubsResponseDTO(row: Clubs): GetClubsResponseDTO {
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

/**
 * Get all clubs
 */
async function getAllClubs(): Promise<GetClubsResponseDTO[]> {
  const allClubs = await ClubRepo.getAll();
  return allClubs.map(toGetClubsResponseDTO);
}

export default {
  getAllClubs,
} as const;
