import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Request, Response } from "express";
import HttpStatusCodes from "../src/common/constants/HttpStatusCodes.js";
import ClubService from "../src/service/ClubService.js";
import ClubRoutes from "../src/routes/ClubRoutes.js";
import type {
  GetClubResponseDTO,
  GetClubsResponseDTO,
} from "../src/dto/ClubDTO.js";

vi.mock("../src/service/ClubService.js", () => ({
  default: {
    getAllClubs: vi.fn(),
    getClub: vi.fn(),
  },
}));

// Create a minimal res mock with chainable methods
function makeRes<T>() {
  return {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    sendStatus: vi.fn().mockReturnThis(),
  } as unknown as Response<T>;
}

describe("ClubRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getAll: returns 200 and list of clubs", async () => {
    const clubs: GetClubsResponseDTO[] = [
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

    vi.mocked(ClubService.getAllClubs).mockResolvedValue(clubs);

    const req = {} as Request; // mock the request and response
    const res = makeRes<GetClubResponseDTO[]>();

    await ClubRoutes.getAll(req, res);
    expect(ClubService.getAllClubs).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(HttpStatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith(clubs);
  });

  it("getOne: returns 200 and club when found, parses id to number", async () => {
    const club: GetClubResponseDTO = {
      id: 7,
      name: "Solihull Indoor Tennis Centre",
      address: {
        id: 3,
        streetNumber: "4",
        streetName: "Station Lane",
        postCode: "B91 2AA",
      },
      courts: [],
    };

    vi.mocked(ClubService.getClub).mockResolvedValue(club);

    const req = { params: { id: "7" } } as unknown as Request;
    const res = makeRes<GetClubResponseDTO>();

    await ClubRoutes.getOne(req, res);

    expect(ClubService.getClub).toHaveBeenCalledWith({ id: 7 });
    expect(res.status).toHaveBeenCalledWith(HttpStatusCodes.OK);
    expect(res.json).toHaveBeenCalledWith(club);
  });

  it("getOne: returns 404 when club not found", async () => {
    vi.mocked(ClubService.getClub).mockResolvedValue(null);

    const req = { params: { id: "999" } } as unknown as Request;
    const res = makeRes<GetClubResponseDTO>();

    await ClubRoutes.getOne(req, res);

    expect(ClubService.getClub).toHaveBeenCalledWith({ id: 999 });
    expect(res.sendStatus).toHaveBeenCalledWith(HttpStatusCodes.NOT_FOUND);
    expect(res.json).not.toHaveBeenCalled();
  });
});
