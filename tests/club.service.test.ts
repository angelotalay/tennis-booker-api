import { describe, beforeEach, vi, it, expect } from "vitest";

import ClubService, {
  toGetClubsResponseDTO,
} from "../src/service/ClubService.js";
import ClubRepo from "../src/repos/ClubRepo.js";
import type { GetClubs } from "../src/types/ClubTypes.js";

/******************************************************************************
 Setup
 ******************************************************************************/
/**
 * Mock the ClubRepo module so that service tests do not hit the real database.
 * This ensures we are strictly unit testing the service layer.
 */
vi.mock("../src/repos/ClubRepo.js", () => ({
  default: {
    getAll: vi.fn(),
  },
}));

/******************************************************************************
 Tests
 IMPORTANT: Following TypeScript best practices, we test all realistic service
 behaviours, including success cases and expected failure propagation from
 dependencies (e.g. repository errors).
 ******************************************************************************/

/**
 * Tests all service functions related to the club model
 */
describe("club.service", () => {
  beforeEach(() => {
    /**
     * Clear all mock call history and implementations between tests
     * to ensure full isolation and prevent cross-test contamination.
     */
    vi.clearAllMocks();
  });

  describe("getAllClubs", () => {
    it("returns a list of clubs mapped to DTOs", async () => {
      const mockClubsFromRepo: GetClubs[] = [
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

      /**
       * Configure the mocked repository method to return controlled test data.
       */
      vi.mocked(ClubRepo.getAll).mockResolvedValue(mockClubsFromRepo);

      const clubsResult = await ClubService.getAllClubs();

      /**
       * Assert that the repository dependency was called exactly once.
       */
      expect(ClubRepo.getAll).toHaveBeenCalledTimes(1);

      /**
       * Assert that the returned data is correctly mapped to DTO format.
       */
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
    });

    it("returns an empty array when no clubs exist", async () => {
      /**
       * Simulate repository returning no data.
       */
      vi.mocked(ClubRepo.getAll).mockResolvedValue([]);

      const clubsResult = await ClubService.getAllClubs();

      /**
       * Assert dependency interaction.
       */
      expect(ClubRepo.getAll).toHaveBeenCalledTimes(1);

      /**
       * Assert correct empty-state handling.
       */
      expect(clubsResult).toEqual([]);
    });

    it("propagates an error when the repository fails", async () => {
      /**
       * Simulate repository failure.
       */
      vi.mocked(ClubRepo.getAll).mockRejectedValue(new Error("Repo failed"));

      /**
       * Assert that the service does not swallow the error.
       */
      await expect(ClubService.getAllClubs()).rejects.toThrow("Repo failed");

      /**
       * Assert dependency interaction.
       */
      expect(ClubRepo.getAll).toHaveBeenCalledTimes(1);
    });
  });
});

/**
 * Tests the DTO mapping functions
 */
describe("toGetClubsResponseDTO (Mapper)", () => {
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

    /**
     * Assert that all fields are correctly transformed.
     */
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
