import { vi } from "vitest";
import type { Response } from "express";

function makeRes<T>(locals: Response["locals"] = {}) {
  const res: Partial<Response<T>> = {
    locals,
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    sendStatus: vi.fn().mockReturnThis(),
  };

  return res as Response<T>;
}

export default makeRes;
