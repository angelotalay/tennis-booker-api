import type { GetSurfaceDTO } from "./SurfaceDTO.js";

/******************************************************************************
 Types
 ******************************************************************************/

// ----------------------- RequestDTO --------------------------------- //

export type GetCourtsRequestDTO = { clubId: number } | { clubId?: never };

export type GetCourtRequestDTO = { courtId: number };

// ----------------------- ResponseDTO --------------------------------- //

export interface GetCourtResponseDTO {
  id: number;
  name: string;
  indoor: boolean;
  surface: string;
  clubId: number;
}
