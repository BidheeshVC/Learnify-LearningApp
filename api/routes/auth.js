const router = require('express').Router();
const { response } = require('express');
const User = require("../models/User");
const bcrypt = require("bcrypt");
const { RegisterUser, LoginUser } = require('../controllers/authController/authController');


// Routes
router.post("/register", RegisterUser); // Register User
router.post("/login",LoginUser); // Login User

module.exports = router;