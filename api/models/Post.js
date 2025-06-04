const mongoose = require('mongoose');


const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    desc: {
        type: String,
        max: 500,
    },
    img: {
        type: String,
    },
    tags: {
        type: [String], // Tags as an array of strings
    },
    emojis: {
        type: [String], // Emojis as an array of strings
    },
    location: {
        latitude: {
            type: Number, // Latitude of the location
            default: 0,   // Default value if not provided
        },
        longitude: {
            type: Number, // Longitude of the location
            default: 0,   // Default value if not provided
        },
    },
    locationName: {
        type: String, // Name of the location
    },
    likes: {
        type: Array,
        default: [],
    },
    savedBy: {
        type: [String], // List of user IDs who saved this post
        default: [],
    },
    username: {
        type: String,
    },
    profilePicture: {
        type: String,
    },
}, { timestamps: true });

module.exports = mongoose.model("Post", PostSchema);



























// const mongoose = require('mongoose');

// const PostSchema = new mongoose.Schema({
//     userId: {
//         type: String,
//         required: true,
//     },
//     desc: {
//         type: String,
//         max: 500,
//     },
//     img: {
//         type: String,
//     },
//     likes: {
//         type: Array,
//         default: [],
//     },
// }, { timestamps: true });

// module.exports = mongoose.model("Post", PostSchema);