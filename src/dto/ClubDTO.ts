import type { GetAddressDTO } from "./AddressDTO.js";
import type { GetCourtDTO } from "./CourtDTO.js";

/******************************************************************************
 Types
 ******************************************************************************/

export interface GetClubRequestDTO {
  id?: number;
  name: string;
}

export interface GetClubResponseDTO {
  id: Number;
  name: string;
  address?: GetAddressDTO;
  courts?: GetCourtDTO[];
}

export interface GetClubsResponseDTO {
  id: number;
  name: string;
  address: GetAddressDTO;
}
