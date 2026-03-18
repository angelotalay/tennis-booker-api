import server from "./server.js";

/******************************************************************************
 Constants
 ******************************************************************************/

const SERVER_START_MESSAGE = "Express server started on port: 3000";

/******************************************************************************
 Run
 ******************************************************************************/

// Start the server
server.listen(3000, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.log(SERVER_START_MESSAGE);
  }
});
