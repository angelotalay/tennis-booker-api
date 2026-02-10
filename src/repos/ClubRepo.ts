import {prisma} from "./db/client.js";
import {Prisma} from "../../generated/prisma/client.js"

/******************************************************************************
Types
 ******************************************************************************/


type ClubFindUniqueArgs = Prisma.Args<typeof prisma.club, "findUnique">;

type ClubFindUniqueResult = Prisma.Result<
  typeof prisma.club,
  ClubFindUniqueArgs,
  "findUnique"
>;
type ClubFindManyArgs = Prisma.Args<typeof prisma.club, "findMany">

type ClubFindManyResult = Prisma.Result<typeof prisma.club, ClubFindManyArgs, "findMany">


/******************************************************************************
Functions
 ******************************************************************************/

/**
 * Get one club
 */
async function getOne({where}: {where: ClubFindUniqueArgs["where"]}): Promise<ClubFindUniqueResult> {
    return prisma.club.findUnique({
        where
    })
}

/**
 * Get all clubs
 */
async function getAll(): Promise<ClubFindManyResult> {
    return prisma.club.findMany({})
}

export default {
    getOne, getAll
} as const


