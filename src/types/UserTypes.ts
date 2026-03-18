import * as z from "zod";

import { Prisma } from "@/generated/prisma/client.js";
import UserSchema from "@/src/validation/UserSchema.js";
/******************************************************************************
 Types
 ******************************************************************************/
// ----------------------- Prisma return types --------------------------------- //
export type GetUser = Prisma.UserGetPayload<{
  include: {
    contact: true;
  };
}>;

export type GetUsers = GetUser[];

// ----------------------- Request types --------------------------------- //
export type GetUserParams = z.infer<typeof UserSchema.userParamsSchema>;

// ----------------------- Response DTO types --------------------------------- //
