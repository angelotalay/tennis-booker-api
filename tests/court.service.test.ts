import { describe, vi, it, expect } from "vitest";

import CourtRepo from "../src/repos/CourtRepo.js";
import type { CourtModel } from "../generated/prisma/models/Court.js";
import CourtService, {
  toGetCourtResponseDTO,
} from "../src/service/CourtService.js";
import type { GetCourts, GetCourt } from "../src/types/CourtTypes.js";
import type { GetCourtResponseDTO } from "../src/dto/CourtDTO.js";

/******************************************************************************
 Setup
 ******************************************************************************/
vi.mock("repo/CourtRepo.js");

/******************************************************************************
Constants
 ******************************************************************************/
const MOCKED_COURTS_FROM_REPO: CourtModel[] = [
  {
    id: 1,
    name: "Court 1",
    clubId: 1,
    surface: "CARPET",
    indoor: false,
  },
  { id: 1, name: "Court 2", clubId: 2, surface: "HARD", indoor: true },
];

const MOCKED_COURT_FROM_REPO: GetCourt = {
  clubId: 1,
  club: {
    id: 1,
    name: "Birmingham Central",
    addressId: 1,
  },
  id: 1,
  name: "Court 1",
  surface: "CARPET",
  indoor: true,
};
/******************************************************************************
 Tests
 IMPORTANT: Following TypeScript best practices, we test all scenarios that
 can be triggered by a user under normal circumstances. Not all theoretically
 scenarios (i.e. a failed database connection).
 ******************************************************************************/

/**
 * getAllCourts function
 * Scenarios:
 * 1 - User provides club id, service function is called with id and finds appropriate courts for a club.
 * 2 - No id is provided, and all courts are found.
 */
describe("getAllCourts", () => {
  it("should return a list of courts filtered by clubId", async () => {
    const mockData: CourtModel[] = [MOCKED_COURTS_FROM_REPO[0]];

    const getAllSpy = vi.spyOn(CourtRepo, "getAll").mockResolvedValue(mockData);

    const courtResult = await CourtService.getAllCourts({ clubId: 1 });

    expect(courtResult).toHaveLength(1);
    expect(courtResult[0]).toEqual({
      id: 1,
      name: "Court 1",
      clubId: 1,
      surface: "CARPET",
      indoor: false,
    });

    expect(getAllSpy).toHaveBeenCalledWith({ clubId: 1 });
  });

  it("should return a list of courts without a clubId", async () => {
    const getAllSpy = vi
      .spyOn(CourtRepo, "getAll")
      .mockResolvedValue(MOCKED_COURTS_FROM_REPO);

    const courtResult = await CourtService.getAllCourts();

    expect(courtResult).toHaveLength(2);
    expect(getAllSpy).toHaveBeenCalledWith({});
  });
});

/**
 * getCourt Function
 * Scenarios:
 * 1 - User provides id, service function is called with id and finds appropriate court.
 * 2 - User provides id, service function is called with id and doesn't find court.
 * 3 - No id is provided, and no court is found.
 */
describe("getCourt", () => {
  it("Should return a court using a given ID", async () => {
    const getOneSpy = vi
      .spyOn(CourtRepo, "getOne")
      .mockResolvedValue(MOCKED_COURT_FROM_REPO);
    const courtResult: GetCourtResponseDTO | null = await CourtService.getCourt(
      { clubId: 1 },
    );

    expect(courtResult).toEqual({
      id: 1,
      name: "Court 1",
      clubId: 1,
      surface: "CARPET",
      indoor: true,
    });
  });
});

/**
 * DTO Mapping Function
 */
describe("toGetCourtsResponseDTO (Mapper", () => {
  it("maps a GetCourts row into GetCourtsResponseDTO", () => {
    const row: GetCourts = MOCKED_COURTS_FROM_REPO[0];

    const dto = toGetCourtResponseDTO(row);
    expect(dto).toEqual({
      id: 1,
      name: "Court 1",
      clubId: 1,
      surface: "CARPET",
      indoor: false,
    });
  });
});
