import type { GetSurfaceDTO } from "./SurfaceDTO.js";

/******************************************************************************
 Types
 ******************************************************************************/

export interface GetCourtDTO {
  id: number;
  indoor: boolean;
  surface: Partial<GetSurfaceDTO>;
}
