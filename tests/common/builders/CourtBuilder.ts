import type { GetCourt } from "@/types/CourtTypes.js";
import type { GetClub, GetClubs } from "@/types/ClubTypes.js";
import BaseBuilder from "@tests/common/builders/BaseBuilder.js";

/******************************************************************************
Types
 ******************************************************************************/
type Surface = GetCourt["surface"];

/******************************************************************************
Class
 ******************************************************************************/

class CourtBuilder extends BaseBuilder<GetCourt> {
  constructor() {
    super({
      id: 1,
      name: "Court 1",
      clubId: 1,
      surface: "CARPET",
      indoor: true,
      club: {
        id: 1,
        name: "Birmingham Central",
        addressId: 1,
      },
    });
  }

  public withName(name: string) {
    this.entity.name = name;
  }

  public withClubId(clubId: number) {
    this.entity.clubId = clubId;
  }

  public withSurface(surface: Surface) {
    this.entity.surface = surface;
  }

  public withIndoor(indoor: boolean) {
    this.entity.indoor = indoor;
  }

  public withClub(club: GetClubs) {
    this.entity.club = club;
  }
}

export default CourtBuilder;
