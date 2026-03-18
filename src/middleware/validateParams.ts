import * as z from "zod";
import type { NextFunction, Request, Response } from "express";
import HttpStatusCodes from "@/common/constants/HttpStatusCodes.js";

/******************************************************************************
 Functions
 ******************************************************************************/
export const validateParams =
  <S extends z.ZodObject<z.ZodRawShape>>(schema: S) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        errors: result.error.issues,
      });
    }

    // Store the validated / cleaned data into temporary local storage
    res.locals.params = result.data;
    next();
  };

/******************************************************************************
 Export
 ******************************************************************************/
export default validateParams;
