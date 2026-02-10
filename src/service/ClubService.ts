import ClubRepo from "../repos/ClubRepo.js";



/******************************************************************************
 Functions
 ******************************************************************************/

/**
 * Get one club by name
 */
async function getClubByName(name: string){
  return ClubRepo.getOne({
    where: {name},
  })
}

/**
 * Get all clubs
 */

async function getAllClubs(){
  return ClubRepo.getAll()
};

export default {
  getClubByName, getAllClubs
} as const


