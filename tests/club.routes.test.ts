import { it, vi, describe, expect, beforeEach } from "vitest";
import type { Request } from "express";

import type {
  GetClubResponseDTO,
  GetClubsResponseDTO,
} from "../src/dto/ClubDTO.js";
import ClubService from "../src/service/ClubService.js";
import makeRes from "./common/makeRes.js";
import ClubRoutes from "../src/routes/ClubRoutes.js";
import HttpStatusCodes from "../src/common/constants/HttpStatusCodes.js";

/******************************************************************************
 Setup
 ******************************************************************************/
vi.mock("../src/service/ClubService.js", () => ({
  default: {
    getAllClubs: vi.fn(),
    getClub: vi.fn(),
  },
}));

/******************************************************************************
 Constants
 ******************************************************************************/
const CLUB: GetClubResponseDTO = {
  id: 1,
  name: "Birmingham Central Tennis",
  address: {
    id: 1,
    streetNumber: "12",
    streetName: "High Street",
    postCode: "B1 1AA",
  },
};

const CLUBS: GetClubsResponseDTO[] = [
  {
    id: 1,
    name: "Birmingham Central Tennis",
    address: {
      id: 1,
      streetNumber: "12",
      streetName: "High Street",
      postCode: "B1 1AA",
    },
  },
];

/******************************************************************************
 Tests
 IMPORTANT: Following TypeScript best practices, we test all scenarios that
 can be triggered by a user under normal circumstances. Not all theoretically
 scenarios (i.e. a failed database connection).
 ******************************************************************************/

describe("club.routes", () => {
  beforeEach(() => vi.clearAllMocks());

  it("getAll : Returns an array of clubs and returns 200 status", async () => {
    // Mock the service and the returned array
    vi.mocked(ClubService.getAllClubs).mockResolvedValue(CLUBS);

    const req = {} as Request;
    const res = makeRes<GetClubsResponseDTO[]>();

    await ClubRoutes.getAll(req, res);

    expect(ClubService.getAllClubs).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(HttpStatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith(CLUBS);
  });

  it("getOne: Returns one club, returns 200 status", async () => {
    vi.mocked(ClubService.getClub).mockResolvedValue(CLUB);

    const req = {} as Request;
    const res = makeRes<GetClubResponseDTO>({
      params: { id: 1 },
    });

    await ClubRoutes.getOne(req, res);

    expect(ClubService.getClub).toHaveBeenCalledTimes(1);
    expect(ClubService.getClub).toHaveBeenCalledWith({ id: 1 });
    expect(res.status).toHaveBeenCalledWith(HttpStatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith(CLUB);
  });

  it("getOne: No club found, returns 404", async () => {
    vi.mocked(ClubService.getClub).mockResolvedValue(null);

    const req = {} as Request;
    const res = makeRes<GetClubResponseDTO>({
      params: { id: 99 },
    });

    await ClubRoutes.getOne(req, res);

    expect(ClubService.getClub).toHaveBeenCalledTimes(1);
    expect(ClubService.getClub).toHaveBeenCalledWith({ id: 99 });
    expect(res.sendStatus).toHaveBeenCalledWith(HttpStatusCodes.NOT_FOUND);
    expect(res.json).not.toHaveBeenCalled();
  });
});
