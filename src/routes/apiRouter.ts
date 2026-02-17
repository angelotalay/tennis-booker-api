import { Router } from "express";

import ClubRoutes from "./ClubRoutes.js";

/******************************************************************************
 Setup
 ******************************************************************************/
const apiRouter: Router = Router();

// ----------------------- Add ClubRouter --------------------------------- //

const clubRouter: Router = Router();

clubRouter.get("/all", ClubRoutes.getAll);
// clubRouter.get("/:name", ClubRoutes.getOne);

apiRouter.use("/club", clubRouter);

/******************************************************************************
 Setup
 ******************************************************************************/
export default apiRouter;
