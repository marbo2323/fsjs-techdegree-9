const express = require("express");
const { asyncHandler } = require("../../middleware/async-handler");
const { authenticateUser } = require("../../middleware/auth-user");
const { User } = require("../../models");

const router = express.Router();

router.get(
  "/",
  authenticateUser,
  asyncHandler(async (req, res) => {
    const user = await User.findByPk(req.currentUser.id, {
      attributes: ["id", "firstName", "lastName", "emailAddress"],
    });
    res.json(user);
  })
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    await User.create(req.body);
    res.status(201).location("back").end();
  })
);

module.exports = router;
