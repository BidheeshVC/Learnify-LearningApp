const express = require('express');
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const router = express.Router();


// Register
const RegisterUser = async (req, res) => {
    console.log("response body in register controller: ", req.body);
    try {
        // Check if the username already exists in the database
        const existingUser = await User.findOne({ username: req.body.username });
        console.log("existing user in register controller:", existingUser);
        if (existingUser) {
            // If the username is already taken, return a 400 Bad Request error
            return res.status(400).json("Username already exists");
        }

        // Generate a salt for hashing the password
        const salt = await bcrypt.genSalt(10);
        console.log("salt in register controller:", salt);
        
        // Hash the user's password using the generated salt
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        console.log("hashed password in register controller:", hashedPassword);

        // Create a new user instance with the provided username, email, and hashed password
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        console.log("new user in register controller:", newUser);

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Log the saved user to the console (for debugging)
        console.log("saved user", savedUser);

        // Respond with the saved user object (you may want to exclude the password in production)
        res.status(200).json(savedUser);
    } catch (err) {
        // If an error occurs, respond with a 500 Internal Server Error
        res.status(500).json(err);
    }
}


// Login
const LoginUser = async (req, res) => {
    try {
        console.log("response body in login controller: ", req.body);
        // find user by email
        const user = await User.findOne({ email: req.body.email });
        console.log("user in login controller:", user);
        // if user not found                
        !user && res.status(404).json("user not found");
        // compare password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        // if password is wrong
        !validPassword && res.status(400).json("wrong password");
        // respond with user
        res.status(200).json({ user: user, message: "Login successful" });
    } catch (err) {
        response.status(500).json(err);
    }
}
module.exports = {
    RegisterUser,
    LoginUser,
};
