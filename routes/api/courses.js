const express = require("express");
const { asyncHandler } = require("../../middleware/async-handler");
const { authenticateUser } = require("../../middleware/auth-user");
const { notFoundError } = require("../../middleware/errors");
const { Course, User } = require("../../models");

const router = express.Router();

// Get All courses
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "emailAddress"],
          as: "user",
        },
      ],
    });
    res.json(courses);
  })
);

// Get one course by primary key
router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const course = await Course.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["id", "firstName", "lastName", "emailAddress"],
          as: "user",
        },
      ],
    });
    if (course) {
      res.json(course);
    } else {
      next(notFoundError("Course not found"));
    }
  })
);

// Add new course
router.post(
  "/",
  asyncHandler(async (req, res) => {
    console.log(JSON.stringify(req.body));
    const course = await Course.create(req.body);
    res.status(201).location("back").end();
  })
);

// Update course identified by given primary key
router.put(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      await course.update(req.body);
      res.status(204).end();
    } else {
      next(notFoundError("Course not found"));
    }
  })
);

// delete course
router.delete(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      await course.delete();
      res.status(204).end();
    } else {
      next(notFoundError("Course not found"));
    }
  })
);

module.exports = router;
