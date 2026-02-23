/******************************************************************************
 Types
 ******************************************************************************/

// ----------------------- RequestDTO --------------------------------- //

export type GetCourtsRequestDTO = { clubId: number } | { clubId?: never };

// ----------------------- ResponseDTO --------------------------------- //

export interface GetCourtResponseDTO {
  id: number;
  name: string;
  indoor: boolean;
  surface: string;
  clubId: number;
}
