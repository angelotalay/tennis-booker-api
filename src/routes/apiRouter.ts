import { Router } from "express";

import ClubRoutes from "./ClubRoutes.js";
import validateParams from "@/src/middleware/validateParams.js";
import clubParamsSchema from "@/src/validation/ClubSchema.js";

import CourtRoutes from "./CourtRoutes.js";
import courtParamsSchema from "@/src/validation/CourtSchema.js";

/******************************************************************************
 Setup
 ******************************************************************************/
const apiRouter: Router = Router();

// ----------------------- Add ClubRouter --------------------------------- //

const clubRouter: Router = Router();

clubRouter.get("/", ClubRoutes.getAll);
clubRouter.get("/:id", validateParams(clubParamsSchema), ClubRoutes.getOne);

apiRouter.use("/club", clubRouter);

// ----------------------- Add CourtRouter --------------------------------- //
const courtRouter: Router = Router();

courtRouter.get("/", CourtRoutes.getAll);
courtRouter.get("/:id", validateParams(courtParamsSchema), CourtRoutes.getOne);

apiRouter.use("/court", courtRouter);
/******************************************************************************
Exports
 ******************************************************************************/
export default apiRouter;
