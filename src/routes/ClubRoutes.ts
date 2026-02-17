import type { Request, Response } from "express";

import ClubService from "../service/ClubService.js";
import type { GetClubResponseDTO } from "../dto/ClubDTO.js";

/******************************************************************************
 Functions
 ******************************************************************************/

/**
 * Get all clubs
 * @route GET /api/club/all
 */
async function getAll(_: Request, res: Response<GetClubResponseDTO[]>) {
  const clubs = await ClubService.getAllClubs();
  return res.status(200).json(clubs);
}

export default { getAll } as const;
