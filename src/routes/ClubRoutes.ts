import type { Request, Response } from "express";

import ClubService from "../service/ClubService.js";
import type {
  GetClubResponseDTO,
  GetClubsResponseDTO,
} from "../dto/ClubDTO.js";
import HttpStatusCodes from "../common/constants/HttpStatusCodes.js";

/******************************************************************************
 Functions
 ******************************************************************************/

/**
 * Get all clubs
 * @route GET /api/club/all
 */
async function getAll(_: Request, res: Response<GetClubsResponseDTO[]>) {
  const clubs: GetClubsResponseDTO[] = await ClubService.getAllClubs();
  return res.status(HttpStatusCodes.OK).json(clubs);
}

/**
 * Get one club using ID
 * @route GET /api/club/:id
 */
async function getOne(req: Request, res: Response<GetClubResponseDTO>) {
  // validation of request will be done later
  // We parse id into number
  const { id: idString } = req.params;
  const id: number = Number(idString);
  const club: GetClubResponseDTO | null = await ClubService.getClub({ id });
  if (!club) {
    return res.sendStatus(HttpStatusCodes.NOT_FOUND);
  }
  return res.status(HttpStatusCodes.OK).json(club);
}

export default { getAll, getOne } as const;
