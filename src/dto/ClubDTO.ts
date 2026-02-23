import type { GetAddressDTO } from "./AddressDTO.js";

/******************************************************************************
 Types
 ******************************************************************************/
// ----------------------- ResponseDTO --------------------------------- //

export interface GetClubResponseDTO {
  id: number;
  name: string;
  address?: GetAddressDTO;
  courts?: {
    id: number;
    name: string;
    indoor: boolean;
  }[];
}

export interface GetClubsResponseDTO {
  id: number;
  name: string;
  address: GetAddressDTO;
}
