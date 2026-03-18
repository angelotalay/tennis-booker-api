import type { GetUser } from "@/src/types/UserTypes.js";

/******************************************************************************
 Functions
 ******************************************************************************/
// ----------------------- DTO Mapping --------------------------------- //
function toGetUserResponseDTO(user: GetUser) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`,
    contactDetails: user.contact,
  };
}

/******************************************************************************
 Exports
 ******************************************************************************/

export default toGetUserResponseDTO;
