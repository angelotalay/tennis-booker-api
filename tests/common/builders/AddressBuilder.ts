import type { GetClubs } from "@/types/ClubTypes.js";

/******************************************************************************
Types
 ******************************************************************************/
type Address = GetClubs["address"];

/******************************************************************************
Classes
 ******************************************************************************/

class AddressBuilder {
  private address: Address;

  public constructor() {
    this.address = {
      id: 10,
      streetNumber: "12",
      streetName: "High Street",
      postCode: "B1 1AA",
    };
  }

  public withId(id: number): this {
    this.address.id = id;
    return this;
  }

  public withStreetNumber(streetNumber: string): this {
    this.address.streetNumber = streetNumber;
    return this;
  }

  public withStreetName(streetName: string): this {
    this.address.streetName = streetName;
    return this;
  }

  public withPostCode(postCode: string): this {
    this.address.postCode = postCode;
    return this;
  }

  public build(): Address {
    return structuredClone(this.address);
  }
}

/******************************************************************************
Exports
 ******************************************************************************/
export default AddressBuilder;
