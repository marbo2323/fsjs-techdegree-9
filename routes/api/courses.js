const express = require("express");
const { asyncHandler } = require("../../middleware/async-handler");
const { authenticateUser } = require("../../middleware/auth-user");
const { notFoundError, forbiddenError } = require("../../middleware/errors");
const { Course, User } = require("../../models");

const router = express.Router();

// Get All courses
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
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
      attributes: { exclude: ["createdAt", "updatedAt"] },
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
  authenticateUser,
  asyncHandler(async (req, res) => {
    console.log(JSON.stringify(req.body));
    const course = await Course.create(req.body);
    res
      .status(201)
      .location(req.baseUrl + "/" + course.id)
      .end();
  })
);

// Update course identified by given primary key
router.put(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      if (course.userId === req.currentUser.id) {
        await course.update(req.body);
        res.status(204).end();
      } else {
        next(forbiddenError());
      }
    } else {
      next(notFoundError("Course not found"));
    }
  })
);

// delete course
router.delete(
  "/:id",
  authenticateUser,
  asyncHandler(async (req, res, next) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      if (course.userId === req.currentUser.id) {
        await course.destroy();
        res.status(204).end();
      } else {
        next(forbiddenError());
      }
    } else {
      next(notFoundError("Course not found"));
    }
  })
);

module.exports = router;
