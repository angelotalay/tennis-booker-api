import express from "express";
import apiRouter from "./routes/apiRouter.js"

/******************************************************************************
 Setup
 ******************************************************************************/

const app = express();

// **** Middleware **** //

// ** Basic Middleware ** //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Environment related tasks here


// **** Add APIs **** //
app.use("/api", apiRouter);

// Error handler goes here

export default app;