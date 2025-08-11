const router = require("express").Router();
const {
    createCourse,
    updateCourse,
    deleteCourse,
    getCourse,
    getAllCourses,
    getCoursesByUserId
} = require("../controllers/courseController/courseController");

// CREATE a course
router.post("/", createCourse);

// UPDATE a course
router.put("/:id", updateCourse);

// DELETE a course
router.delete("/:id", deleteCourse);

// GET single course by ID
router.get("/:id", getCourse);

// GET all courses
router.get("/", getAllCourses);

// GET all courses by a specific user
router.get("/user/:userId", getCoursesByUserId);

module.exports = router;
