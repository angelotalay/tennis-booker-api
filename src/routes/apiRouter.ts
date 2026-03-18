import { Router } from "express";

import ClubRoutes from "./ClubRoutes.js";
import validateParams from "@/src/middleware/validateParams.js";
import ClubSchema from "@/src/validation/ClubSchema.js";

import CourtRoutes from "./CourtRoutes.js";
import CourtSchema from "@/src/validation/CourtSchema.js";
import validateQuery from "@/src/middleware/validateQuery.js";

/******************************************************************************
 Setup
 ******************************************************************************/
const apiRouter: Router = Router();

// ----------------------- Add ClubRouter --------------------------------- //

const clubRouter: Router = Router();

clubRouter.get("/", ClubRoutes.getAll);
clubRouter.get(
  "/:id",
  validateParams(ClubSchema.clubParamsSchema),
  ClubRoutes.getOne,
);

apiRouter.use("/club", clubRouter);

// ----------------------- Add CourtRouter --------------------------------- //
const courtRouter: Router = Router();

courtRouter.get(
  "/",
  validateQuery(CourtSchema.courtsQuerySchema),
  CourtRoutes.getAll,
);
courtRouter.get(
  "/:id",
  validateParams(CourtSchema.courtParamsSchema),
  CourtRoutes.getOne,
);

apiRouter.use("/court", courtRouter);
/******************************************************************************
Exports
 ******************************************************************************/
export default apiRouter;
