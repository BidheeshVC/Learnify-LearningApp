// controllers/courseController/courseController.js
const fs = require("fs");
const path = require("path");   
const Course = require("../../models/Course");

// CREATE COURSE
const createCourse = async (req, res) => {
    console.log("Create course request body:", req.body);

    const newCourse = new Course({
        ...req.body,
        lessons: req.body.lessons || [], // Default empty array if no lessons
    });

    try {
        const savedCourse = await newCourse.save();
        console.log("Saved course:", savedCourse);
        res.status(200).json(savedCourse);
    } catch (err) {
        console.error("Error creating course:", err);
        res.status(500).json(err);
    }
};

// UPDATE COURSE
const updateCourse = async (req, res) => {
    console.log("Update course params:", req.params);
    console.log("Update course body:", req.body);

    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json("Course not found");
        }

        if (course.userId === req.body.userId) {
            await course.updateOne({ $set: req.body });
            res.status(200).json("The course has been updated");
        } else {
            res.status(403).json("You can update only your own course");
        }
    } catch (err) {
        console.error("Error updating course:", err);
        res.status(500).json(err);
    }
};

// DELETE COURSE
const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json("Course not found");
        }

        if (course.userId !== req.body.userId) {
            return res.status(403).json("You can delete only your own course");
        }

        await course.deleteOne();
        res.status(200).json("The course has been deleted successfully");
    } catch (err) {
        console.error("Error deleting course:", err);
        res.status(500).json(err);
    }
};

// GET SINGLE COURSE
const getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json("Course not found");
        }
        res.status(200).json(course);
    } catch (err) {
        console.error("Error getting course:", err);
        res.status(500).json(err);
    }
};

// GET ALL COURSES
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 });
        res.status(200).json(courses);
    } catch (err) {
        console.error("Error getting all courses:", err);
        res.status(500).json(err);
    }
};

// GET COURSES BY USER ID
const getCoursesByUserId = async (req, res) => {
    try {
        const courses = await Course.find({ userId: req.params.userId });
        res.status(200).json(courses);
    } catch (err) {
        console.error("Error getting courses by user:", err);
        res.status(500).json(err);
    }
};

module.exports = {
    createCourse,
    updateCourse,
    deleteCourse,
    getCourse,
    getAllCourses,
    getCoursesByUserId
};
