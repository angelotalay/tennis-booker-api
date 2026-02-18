import { Router } from "express";

import ClubRoutes from "./ClubRoutes.js";

/******************************************************************************
 Setup
 ******************************************************************************/
const apiRouter: Router = Router();

// ----------------------- Add ClubRouter --------------------------------- //

const clubRouter: Router = Router();

clubRouter.get("/all", ClubRoutes.getAll);
apiRouter.use("/club", clubRouter);

/******************************************************************************
Exports
 ******************************************************************************/
export default apiRouter;
