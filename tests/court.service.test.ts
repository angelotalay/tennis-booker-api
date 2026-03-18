import { describe, it, expect, vi, beforeEach } from "vitest";

import CourtRepo from "../src/repos/CourtRepo.js";
import CourtService, {
  toGetCourtResponseDTO,
} from "../src/service/CourtService.js";

import type { CourtModel } from "../generated/prisma/models/Court.js";
import type { GetCourt, GetCourts } from "@/types/CourtTypes.js";
import type { GetCourtResponseDTO } from "@/dto/CourtDTO.js";
import CourtBuilder from "@tests/common/builders/CourtBuilder.js";

vi.mock("../src/repos/CourtRepo.js");

beforeEach(() => {
  vi.clearAllMocks();
});

/******************************************************************************
 * Test data factories
 ******************************************************************************/

const CourtListBuilder = CourtBuilder.CourtListBuilder;
const CourtDetailBuilder = CourtBuilder.CourtDetailBuilder;

const MOCKED_COURTS_FROM_REPO: CourtModel[] = [
  new CourtListBuilder()
    .withId(1)
    .withName("Court 1")
    .withClubId(1)
    .withSurface("CARPET")
    .withIndoor(false)
    .build(),
  new CourtListBuilder()
    .withId(2)
    .withName("Court 2")
    .withClubId(2)
    .withSurface("HARD")
    .withIndoor(true)
    .build(),
];

const MOCKED_COURT_FROM_REPO: GetCourt = new CourtDetailBuilder()
  .withId(1)
  .withName("Court 1")
  .withClubId(1)
  .withSurface("CARPET")
  .withIndoor(true)
  .build();

/******************************************************************************
 * Tests
 ******************************************************************************/

describe("CourtService.getAllCourts", () => {
  it("returns courts filtered by clubId", async () => {
    const repoResponse: CourtModel[] = [MOCKED_COURTS_FROM_REPO[0]];

    vi.mocked(CourtRepo.getAll).mockResolvedValue(repoResponse);

    const result = await CourtService.getAllCourts({ clubId: 1 });

    expect(CourtRepo.getAll).toHaveBeenCalledWith({ clubId: 1 });
    expect(CourtRepo.getAll).toHaveBeenCalledTimes(1);

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
    vi.mocked(CourtRepo.getAll).mockResolvedValue(MOCKED_COURTS_FROM_REPO);

    const result = await CourtService.getAllCourts();

    expect(CourtRepo.getAll).toHaveBeenCalledWith({});
    expect(CourtRepo.getAll).toHaveBeenCalledTimes(1);

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
    vi.mocked(CourtRepo.getOne).mockResolvedValue(MOCKED_COURT_FROM_REPO);

    const result: GetCourtResponseDTO | null = await CourtService.getCourt({
      courtId: 1,
    });

    expect(CourtRepo.getOne).toHaveBeenCalledWith({ courtId: 1 });
    expect(CourtRepo.getOne).toHaveBeenCalledTimes(1);

    expect(result).toEqual({
      id: 1,
      name: "Court 1",
      clubId: 1,
      surface: "CARPET",
      indoor: true,
    });
  });

  it("returns null when no matching court is found", async () => {
    vi.mocked(CourtRepo.getOne).mockResolvedValue(null);

    const result = await CourtService.getCourt({ courtId: 999 });

    expect(CourtRepo.getOne).toHaveBeenCalledWith({ id: 999 });
    expect(CourtRepo.getOne).toHaveBeenCalledTimes(1);

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
