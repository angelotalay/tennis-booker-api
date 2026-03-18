import BaseBuilder from "@tests/common/builders/BaseBuilder.js";
import type { GetClub } from "@/types/ClubTypes.js";

/******************************************************************************
 Types
 ******************************************************************************/
type Address = GetClub["address"];
/******************************************************************************
 Class
 ******************************************************************************/

class ClubBuilder extends BaseBuilder<GetClub> {
  constructor() {
    super({
      id: 1,
      name: "Birmingham Central Tennis",
      address: {
        id: 1,
        streetNumber: "12",
        streetName: "High Street",
        postCode: "B1 1AA",
      },
    });
  }

  public withName(name: string) {
    this.entity.name = name;
  }

  public withAddress(address: Address) {
    this.entity.address = address;
  }
}

export default ClubBuilder;
