import { Router } from "express";

import ClubRoutes from "./ClubRoutes.js";

/******************************************************************************
 Setup
 ******************************************************************************/
const apiRouter: Router = Router();

// ----------------------- Add ClubRouter --------------------------------- //

const clubRouter: Router = Router();

clubRouter.get("/", ClubRoutes.getAll);
clubRouter.get("/:id", ClubRoutes.getOne);
apiRouter.use("/club", clubRouter);

/******************************************************************************
Exports
 ******************************************************************************/
export default apiRouter;
