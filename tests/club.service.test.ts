import { describe, beforeEach, vi, it, expect } from "vitest";

import ClubService, {
  toGetClubsResponseDTO,
} from "../src/service/ClubService.js";
import ClubRepo from "../src/repos/ClubRepo.js";
import type { GetClubs } from "../src/types/Club.js";

/******************************************************************************
 Setup
 ******************************************************************************/
vi.mock("repo/ClubRepo.js");

/******************************************************************************
 Tests
 IMPORTANT: Following TypeScript best practices, we test all scenarios that
 can be triggered by a user under normal circumstances. Not all theoretically
 scenarios (i.e. a failed database connection).
 ******************************************************************************/

describe("club.service", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe("getAllClubs", () => {
    it("It should return a list of clubs matched to DTOs", async () => {
      const mockClubsFromRepo = [
        {
          id: 1,
          name: "Tennis Center",
          address: {
            id: 10,
            streetNumber: "1",
            streetName: "Ace Ave",
            postCode: "SW1",
          },
        },
        {
          id: 2,
          name: "Tennis Centre 2",
          address: {
            id: 9,
            streetNumber: "2",
            streetName: "Shank Land",
            postCode: "SW2",
          },
        },
      ];

      // Tell the mock Repo to return our fake data
      // vi.mocked doesn't apply the mockResolvedValue, so use spyOn instead
      const getAllSpy = vi
        .spyOn(ClubRepo, "getAll")
        .mockResolvedValue(mockClubsFromRepo);

      const clubsResult = await ClubService.getAllClubs();

      expect(clubsResult).toHaveLength(2);
      expect(clubsResult[0]).toEqual({
        id: 1,
        name: "Tennis Center",
        address: {
          id: 10,
          streetNumber: "1",
          streetName: "Ace Ave",
          postCode: "SW1",
        },
      });
      expect(ClubRepo.getAll).toHaveBeenCalledTimes(1);
    });
  });
});

describe("toGetClubsResponseDTO (Mapper", () => {
  it("maps a GetClubs row into GetClubsResponseDTO", () => {
    const row: GetClubs = {
      id: 1,
      name: "Birmingham Central",
      address: {
        id: 10,
        streetNumber: "12",
        streetName: "High Street",
        postCode: "B1 1AA",
      },
    };

    const dto = toGetClubsResponseDTO(row);
    expect(dto).toEqual({
      id: 1,
      name: "Birmingham Central",
      address: {
        id: 10,
        streetNumber: "12",
        streetName: "High Street",
        postCode: "B1 1AA",
      },
    });
  });
});
