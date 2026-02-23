import CourtRepo from "../repos/CourtRepo.js";
import type {
  GetCourtRequestDTO,
  GetCourtsRequestDTO,
} from "../dto/CourtDTO.js";
import type { GetCourts } from "../types/CourtTypes.js";
import type { GetCourtResponseDTO } from "../dto/CourtDTO.js";

/******************************************************************************
 Functions
 ******************************************************************************/
// ----------------------- DTO Mapping --------------------------------- //
export function toGetCourtResponseDTO(court: GetCourts): GetCourtResponseDTO {
  return {
    id: court.id,
    name: court.name,
    surface: court.surface,
    indoor: court.indoor,
    clubId: court.clubId,
  };
}

/**
 * Get all courts for a particular club
 */
// async function getAllCourtsByClub(dto: GetCourts): Promise<GetCourts>  {
//     const allCourts = await CourtRepo.getAll(dto);
//     return allCourts
// }

/**
 * Get all courts or all courts for a club using the clubId
 * @param dto - Data transfer object that is either empty or contains the id of a club
 */
async function getAllCourts(dto: GetCourtsRequestDTO) {
  const allCourts = await CourtRepo.getAll(dto);
  return allCourts.map(toGetCourtResponseDTO);
}

/**
 * Get one club court using the ID of the club
 */

async function getCourt(
  dto: GetCourtRequestDTO,
): Promise<GetCourtResponseDTO | null> {
  const court = await CourtRepo.getOne(dto);
  if (!court) {
    return null;
  }
  return toGetCourtResponseDTO(court);
}

export default {
  getAllCourts,
} as const;
