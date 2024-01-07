"use strict";

const auth = require("basic-auth");
const bcrypt = require("bcryptjs");
const { User } = require("../models");

/* 
  Middleware to authenticate the request using Basic Authentication.
  This function is from the Teamtreehose.com REST API Authentication with Express course and adapted for this project.
  https://teamtreehouse.com/library/rest-api-authentication-with-express-2
*/
exports.authenticateUser = async (req, res, next) => {
  // Parse the user's credentials from the Authorization header.
  const credentials = auth(req);
  let message; // store the message to display

  if (credentials) {
    const user = await User.findOne({
      where: { emailAddress: credentials.name },
    });
    if (user) {
      const authenticated = bcrypt.compareSync(credentials.pass, user.password);
      if (authenticated) {
        // If the passwords match
        console.log(
          `Authentication successful for username: ${user.emailAddress}`
        );

        // Store the user on the Request object.
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.name}`;
    }
  } else {
    message = "Auth header not found";
  }

  if (message) {
    console.warn(message);
    res.status(401).json({ message: "Access Denied" });
  } else {
    next();
  }
};
