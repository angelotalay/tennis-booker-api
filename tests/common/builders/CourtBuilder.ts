import type { GetCourt, GetCourts } from "@/types/CourtTypes.js";
import type { GetClub } from "@/types/ClubTypes.js";
import BaseBuilder from "@tests/common/builders/BaseBuilder.js";

/******************************************************************************
Types
 ******************************************************************************/
type Surface = GetCourt["surface"];

/******************************************************************************
Class
 ******************************************************************************/

class CourtDetailBuilder extends BaseBuilder<GetCourt> {
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
    return this;
  }

  public withClubId(clubId: number) {
    this.entity.clubId = clubId;
    return this;
  }

  public withSurface(surface: Surface) {
    this.entity.surface = surface;
    return this;
  }

  public withIndoor(indoor: boolean) {
    this.entity.indoor = indoor;
    return this;
  }

  public withClub(club: GetClub) {
    this.entity.club = club;
    return this;
  }
}

class CourtListBuilder extends BaseBuilder<GetCourts> {
  constructor() {
    super({
      id: 1,
      name: "Court 1",
      clubId: 1,
      surface: "CARPET",
      indoor: true,
    });
  }

  public withName(name: string) {
    this.entity.name = name;
    return this;
  }

  public withClubId(clubId: number) {
    this.entity.clubId = clubId;
    return this;
  }

  public withSurface(surface: Surface) {
    this.entity.surface = surface;
    return this;
  }

  public withIndoor(indoor: boolean) {
    this.entity.indoor = indoor;
    return this;
  }
}

export default {
  CourtDetailBuilder,
  CourtListBuilder,
} as const;
