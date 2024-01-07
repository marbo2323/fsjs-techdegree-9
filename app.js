"use strict";

// load modules
const express = require("express");
const morgan = require("morgan");
const { sequelize } = require("./models");
const apiRouter = require("./routes/api");

// variable to enable global error logging
const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

// create the Express app
const app = express();

// setup morgan which gives us http request logging
app.use(morgan("dev"));
// setup app to parse json request body
app.use(express.json());

// setup a friendly greeting for the root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the REST API project!",
  });
});

app.use("/api", apiRouter);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found",
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  let errorMessage = err.message;

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    err.status = 400;
    const errors = err.errors.map((err) => err.message);
    errorMessage = errors.length > 1 ? errors : errors[0];
  }

  res.status(err.status || 500).json({
    message: errorMessage,
  });
});

// set our port
app.set("port", process.env.PORT || 5000);

// Test the database connection.
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    // start listening on our port
    const server = app.listen(app.get("port"), () => {
      console.log(
        `Express server is listening on port ${server.address().port}`
      );
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
