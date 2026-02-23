import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import HttpStatusCodes from "@/src/common/constants/HttpStatusCodes.js";

const validateQuery =
  <S extends z.ZodTypeAny>(schema: S) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: result.error.issues,
      });
    }

    res.locals.query = result.data;
    next();
  };

export default validateQuery;
