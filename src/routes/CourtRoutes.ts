import type { Request, Response } from "express";

/******************************************************************************
 Functions
 ******************************************************************************/

/**
 * Get all courts
 * @route GET /api/club/
 */
async function getAll(_: Request, res: Response) {}

/**
 * Get all courts for a specific club
 * @route GET /api/club/all/:id
 */
async function getAllByClub(_: Request, res: Response) {}

/**
 * Get one court using ID
 * @route GET /api/court/:id
 */
async function getOne(req: Request, res: Response) {}

export default { getAll, getOne } as const;
