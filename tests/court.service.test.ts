import { describe, it, expect, vi, afterEach } from "vitest";

import CourtRepo from "../src/repos/CourtRepo.js";
import CourtService, {
  toGetCourtResponseDTO,
} from "../src/service/CourtService.js";

import type { CourtModel } from "../generated/prisma/models/Court.js";
import type { GetCourt, GetCourts } from "@/types/CourtTypes.js";
import type { GetCourtResponseDTO } from "@/dto/CourtDTO.js";

vi.mock("../src/repos/CourtRepo.js");

afterEach(() => {
  vi.restoreAllMocks();
});

/******************************************************************************
 * Test data factories
 ******************************************************************************/

function createCourtModel(overrides: Partial<CourtModel> = {}): CourtModel {
  return {
    id: 1,
    name: "Court 1",
    clubId: 1,
    surface: "CARPET",
    indoor: false,
    ...overrides,
  };
}

function createGetCourt(overrides: Partial<GetCourt> = {}): GetCourt {
  return {
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
    ...overrides,
  };
}

const MOCKED_COURTS_FROM_REPO: CourtModel[] = [
  createCourtModel(),
  createCourtModel({
    id: 2,
    name: "Court 2",
    clubId: 2,
    surface: "HARD",
    indoor: true,
  }),
];

const MOCKED_COURT_FROM_REPO: GetCourt = createGetCourt();

/******************************************************************************
 * Tests
 ******************************************************************************/

describe("CourtService.getAllCourts", () => {
  it("returns courts filtered by clubId", async () => {
    const repoResponse: CourtModel[] = [MOCKED_COURTS_FROM_REPO[0]];
    const getAllSpy = vi
      .spyOn(CourtRepo, "getAll")
      .mockResolvedValue(repoResponse);

    const result = await CourtService.getAllCourts({ clubId: 1 });

    expect(getAllSpy).toHaveBeenCalledWith({ clubId: 1 });
    expect(result).toEqual([
      {
        id: 1,
        name: "Court 1",
        clubId: 1,
        surface: "CARPET",
        indoor: false,
      },
    ]);
  });

  it("returns all courts when no clubId is provided", async () => {
    const getAllSpy = vi
      .spyOn(CourtRepo, "getAll")
      .mockResolvedValue(MOCKED_COURTS_FROM_REPO);

    const result = await CourtService.getAllCourts();

    expect(getAllSpy).toHaveBeenCalledWith({});
    expect(result).toEqual([
      {
        id: 1,
        name: "Court 1",
        clubId: 1,
        surface: "CARPET",
        indoor: false,
      },
      {
        id: 2,
        name: "Court 2",
        clubId: 2,
        surface: "HARD",
        indoor: true,
      },
    ]);
  });
});

describe("CourtService.getCourt", () => {
  it("returns a court DTO when a matching court is found", async () => {
    const getOneSpy = vi
      .spyOn(CourtRepo, "getOne")
      .mockResolvedValue(MOCKED_COURT_FROM_REPO);

    const result: GetCourtResponseDTO | null = await CourtService.getCourt({
      id: 1,
    });

    expect(getOneSpy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual({
      id: 1,
      name: "Court 1",
      clubId: 1,
      surface: "CARPET",
      indoor: true,
    });
  });

  it("returns null when no matching court is found", async () => {
    const getOneSpy = vi.spyOn(CourtRepo, "getOne").mockResolvedValue(null);

    const result = await CourtService.getCourt({ id: 999 });

    expect(getOneSpy).toHaveBeenCalledWith({ id: 999 });
    expect(result).toBeNull();
  });
});

describe("toGetCourtResponseDTO", () => {
  it("maps a court row into a GetCourtResponseDTO", () => {
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
