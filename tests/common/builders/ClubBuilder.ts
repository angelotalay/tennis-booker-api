import BaseBuilder from "@tests/common/builders/BaseBuilder.js";
import type { GetClub, GetClubs } from "@/types/ClubTypes.js";

/******************************************************************************
 Constants
 ******************************************************************************/
const DEFAULT_CLUB_DETAIL: GetClub = {
  id: 1,
  name: "Birmingham Central Tennis",
  addressId: 1,
  address: {
    id: 1,
    streetNumber: "12",
    streetName: "High Street",
    postCode: "B1 1AA",
  },
  courts: [],
};

type Address = GetClubs["address"];

/******************************************************************************
 Class
 ******************************************************************************/
class ClubDetailBuilder extends BaseBuilder<GetClub> {
  public constructor() {
    super(DEFAULT_CLUB_DETAIL);
  }

  public withName(name: string): this {
    this.entity.name = name;
    return this;
  }

  public withAddressId(addressId: number): this {
    this.entity.addressId = addressId;
    return this;
  }

  public withAddress(address: GetClub["address"]): this {
    this.entity.address = address;
    return this;
  }

  public withCourts(courts: GetClub["courts"]): this {
    this.entity.courts = courts;
    return this;
  }

  public withStreetNumber(streetNumber: string): this {
    this.entity.address.streetNumber = streetNumber;
    return this;
  }

  public withStreetName(streetName: string): this {
    this.entity.address.streetName = streetName;
    return this;
  }

  public withPostCode(postCode: string): this {
    this.entity.address.postCode = postCode;
    return this;
  }
}
class ClubListBuilder extends BaseBuilder<GetClubs> {
  public constructor() {
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

  public withName(name: string): this {
    this.entity.name = name;
    return this;
  }

  public withAddress(address: Address): this {
    this.entity.address = address;
    return this;
  }

  public withAddressId(id: number): this {
    this.entity.address.id = id;
    return this;
  }

  public withStreetNumber(streetNumber: string): this {
    this.entity.address.streetNumber = streetNumber;
    return this;
  }

  public withStreetName(streetName: string): this {
    this.entity.address.streetName = streetName;
    return this;
  }

  public withPostCode(postCode: string): this {
    this.entity.address.postCode = postCode;
    return this;
  }
}

export default {
  ClubDetailBuilder,
  ClubListBuilder,
} as const;
