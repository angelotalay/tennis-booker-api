import type { Request, Response } from "express";
import CourtService from "@/src/service/CourtService.js";
import HttpStatusCodes from "@/src/common/constants/HttpStatusCodes.js";
import type { GetCourtResponseDTO } from "@/src/dto/CourtDTO.js";
import type { GetCourtParams, GetCourtsQuery } from "@/src/types/CourtTypes.js";

/******************************************************************************
 Functions
 ******************************************************************************/

/**
 * Get all courts
 * @route GET /api/court/ or GET /api/court/:clubId
 */
async function getAll(req: Request, res: Response) {
  const { clubId } = res.locals.params as GetCourtsQuery;
  const courts: GetCourtResponseDTO[] = await CourtService.getAllCourts(
    clubId !== undefined ? { clubId } : {},
  );
  return res.status(HttpStatusCodes.OK).json(courts);
}

/**
 * Get one court using ID
 * @route GET /api/court/:id
 */
async function getOne(req: Request, res: Response) {
  const { courtId } = res.locals.params as GetCourtParams;
  const court = await CourtService.getCourt({ courtId });
  if (!court) {
    res.sendStatus(HttpStatusCodes.NOT_FOUND);
  }
  return res.status(HttpStatusCodes.OK).json(court);
}

/******************************************************************************
Exports
 ******************************************************************************/
export default { getAll, getOne } as const;
