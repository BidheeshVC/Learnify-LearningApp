    const mongoose = require('mongoose');

    const CommentSchema = new mongoose.Schema({
        userId: {
            type: String,
            required: true,
        },
        postId: {
            type: String,
            required: true,
        },
        text: {
            type: String,
            required: true,
            max: 500,
        },
        likes: {
            type: [String], // List of user IDs who liked this comment
            default: [],
        },
    }, { timestamps: true });

    module.exports = mongoose.model("Comment", CommentSchema);
//
// This code defines a Mongoose schema for comments on posts in a social media application.
// Each comment has a user ID, post ID, text content, and a list of likes (user IDs who liked the comment).
// The schema also includes timestamps for when the comment was created and last updated.
// The model is exported for use in other parts of the application, such as controllers or services.
// This schema is used to create a MongoDB collection for storing comments related to posts.
// It ensures that each comment is associated with a user and a post, and enforces validation rules such as required fields and maximum text length.
// The `likes` field is an array that stores the IDs of users who liked the comment, allowing for easy tracking of likes.
// The `timestamps` option automatically adds `createdAt` and `updatedAt` fields to the documents, providing a record of when each comment was created and last modified.
// This schema is part of a larger application that likely includes user authentication, post management, and comment functionality.
// The `Comment` model can be used in various operations such as creating, retrieving, updating, and deleting comments in the application.

