import type { Request, Response } from "express";

import HttpStatusCodes from "../common/constants/HttpStatusCodes.js";
import ClubService from "../service/ClubService.js";
import type {
  GetClubResponseDTO,
  GetClubsResponseDTO,
} from "../dto/ClubDTO.js";
import type { GetClubParams } from "@/types/ClubTypes.js";

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
async function getOne(_: Request, res: Response<GetClubResponseDTO>) {
  const { id } = res.locals.params as GetClubParams;
  const club: GetClubResponseDTO | null = await ClubService.getClub({ id });
  if (!club) {
    return res.sendStatus(HttpStatusCodes.NOT_FOUND);
  }
  return res.status(HttpStatusCodes.OK).json(club);
}

export default { getAll, getOne } as const;
