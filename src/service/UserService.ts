import UserRepo from "@/src/repos/UserRepo.js";
import type { GetUserParams } from "@/src/types/UserTypes.js";

import UserSchema from "@/src/validation/UserSchema.js";
import { GetUser } from "@/src/types/UserTypes.js";

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

/**
 *
 * @param dto
 */
async function getUser(dto: GetUserParams) {
  const user: GetUser | null = await UserRepo.getOne(dto);
  if (!user) return null;
  return toGetUserResponseDTO(user);
}
