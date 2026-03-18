import { prisma } from "@/src/lib/client.js";
import type { GetUser, GetUsers } from "@/src/types/UserTypes.js";

/******************************************************************************
 Functions
 ******************************************************************************/
/**
 * Get one user with a user ID
 * @param dto - Data transfer object that can contains the id of a particular user
 */
async function getOne(dto: { id: number }): Promise<GetUser | null> {
  return prisma.user.findUnique({
    where: { id: dto.id },
    include: {
      contact: true,
    },
  });
}

async function getAll(): Promise<GetUsers> {
  return prisma.user.findMany({
    include: {
      contact: true,
    },
  });
}

// async function createOne({ dto }) {
//   return prisma.user.create({
//     data: dto,
//   });
// }
//
// async function deleteOne({ dto }) {
//   return prisma.user.delete({
//     where: { dto },
//   });
// }
//
// async function patchOne(dto: { id: number; patch: { any } }) {
//   return prisma.user.update({
//     where: {
//       id: dto.id,
//     },
//     data: {
//       ...dto.patch,
//     },
//   });
// }

/******************************************************************************
 Exports
 ******************************************************************************/
export default {
  getOne,
  getAll,
} as const;
