import { describe, beforeEach, vi, it, expect } from "vitest";

import ClubService, {
  toGetClubResponseDTO,
  toGetClubsResponseDTO,
} from "@/service/ClubService.js";
import ClubRepo from "@/repos/ClubRepo.js";
import ClubBuilder from "@tests/common/builders/ClubBuilder.js";

/******************************************************************************
 Setup
 ******************************************************************************/
vi.mock("@/repos/ClubRepo.js");

/******************************************************************************
 Tests
 IMPORTANT: Following TypeScript best practices, we test all scenarios that
 can be triggered by a user under normal circumstances. Not all theoretical
 scenarios (i.e. a failed database connection).
 ******************************************************************************/

/**
 * Tests all service functions related to the club model
 */
describe("club.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllClubs", () => {
    it("should return a list of clubs mapped to DTOs", async () => {
      const mockClubsFromRepo = [
        new ClubBuilder.ClubListBuilder()
          .withId(1)
          .withName("Tennis Center")
          .withAddressId(10)
          .withStreetNumber("1")
          .withStreetName("Ace Ave")
          .withPostCode("SW1")
          .build(),
        new ClubBuilder.ClubListBuilder()
          .withId(2)
          .withName("Tennis Centre 2")
          .withAddressId(9)
          .withStreetNumber("2")
          .withStreetName("Shank Land")
          .withPostCode("SW2")
          .build(),
      ];

      vi.mocked(ClubRepo.getAll).mockResolvedValue(mockClubsFromRepo);

      const clubsResult = await ClubService.getAllClubs();

      expect(clubsResult).toHaveLength(2);
      expect(clubsResult).toEqual([
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
      ]);
      expect(ClubRepo.getAll).toHaveBeenCalledTimes(1);
    });

    it("should return an empty array when the repo returns no clubs", async () => {
      vi.mocked(ClubRepo.getAll).mockResolvedValue([]);

      const clubsResult = await ClubService.getAllClubs();

      expect(clubsResult).toEqual([]);
      expect(ClubRepo.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("getClub", () => {
    it("should return a mapped club DTO when a club is found", async () => {
      const mockClubFromRepo = new ClubBuilder.ClubDetailBuilder()
        .withId(1)
        .withName("Birmingham Central Tennis")
        .withAddressId(10)
        .withAddress({
          id: 10,
          streetNumber: "12",
          streetName: "High Street",
          postCode: "B1 1AA",
        })
        .withCourts([
          {
            id: 101,
            name: "Court 1",
            clubId: 1,
            surface: "HARD",
            indoor: false,
          },
          {
            id: 102,
            name: "Court 2",
            clubId: 1,
            surface: "CLAY",
            indoor: true,
          },
        ])
        .build();

      vi.mocked(ClubRepo.getOne).mockResolvedValue(mockClubFromRepo);

      const clubResult = await ClubService.getClub({ id: 1 });

      expect(clubResult).toEqual({
        id: 1,
        name: "Birmingham Central Tennis",
        address: {
          id: 10,
          streetNumber: "12",
          streetName: "High Street",
          postCode: "B1 1AA",
        },
        courts: [
          {
            id: 101,
            name: "Court 1",
            indoor: false,
          },
          {
            id: 102,
            name: "Court 2",
            indoor: true,
          },
        ],
      });
      expect(ClubRepo.getOne).toHaveBeenCalledTimes(1);
      expect(ClubRepo.getOne).toHaveBeenCalledWith({ id: 1 });
    });

    it("should return null when no club is found", async () => {
      vi.mocked(ClubRepo.getOne).mockResolvedValue(null);

      const clubResult = await ClubService.getClub({ id: 999 });

      expect(clubResult).toBeNull();
      expect(ClubRepo.getOne).toHaveBeenCalledTimes(1);
      expect(ClubRepo.getOne).toHaveBeenCalledWith({ id: 999 });
    });
  });
});

/**
 * Tests the DTO mapping functions
 */
describe("club.service mappers", () => {
  describe("toGetClubsResponseDTO", () => {
    it("maps a GetClubs row into GetClubsResponseDTO", () => {
      const row = new ClubBuilder.ClubListBuilder()
        .withId(1)
        .withName("Birmingham Central")
        .withAddressId(10)
        .withStreetNumber("12")
        .withStreetName("High Street")
        .withPostCode("B1 1AA")
        .build();

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

  describe("toGetClubResponseDTO", () => {
    it("maps a GetClub row into GetClubResponseDTO", () => {
      const club = new ClubBuilder.ClubDetailBuilder()
        .withId(1)
        .withName("Birmingham Central Tennis")
        .withAddressId(10)
        .withAddress({
          id: 10,
          streetNumber: "12",
          streetName: "High Street",
          postCode: "B1 1AA",
        })
        .withCourts([
          {
            id: 101,
            name: "Court 1",
            clubId: 1,
            surface: "HARD",
            indoor: false,
          },
        ])
        .build();

      const dto = toGetClubResponseDTO(club);

      expect(dto).toEqual({
        id: 1,
        name: "Birmingham Central Tennis",
        address: {
          id: 10,
          streetNumber: "12",
          streetName: "High Street",
          postCode: "B1 1AA",
        },
        courts: [
          {
            id: 101,
            name: "Court 1",
            indoor: false,
          },
        ],
      });
    });
  });
});
