import ClubRepo from "../repos/ClubRepo.js";
import type { GetClubsResponseDTO } from "../dto/ClubDTO.js";

import type { GetClubs } from "../types/Club.js";

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

/**
 * Get all clubs
 */
async function getAllClubs(): Promise<GetClubsResponseDTO[]> {
  // Should return an array of clubs, extracting the appropriate data
  const allClubs = await ClubRepo.getAll();
  return allClubs.map(toGetClubsResponseDTO);
}

export default {
  getAllClubs,
} as const;
