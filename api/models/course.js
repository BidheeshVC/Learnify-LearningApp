// const mongoose = require("mongoose");

// const CourseSchema = new mongoose.Schema(
//   {
//     userId: { type: String, required: true },
//     title: { type: String, required: true },
//     description: { type: String },
//     category: { type: String },
//     price: { type: Number },
//     lessons: [
//       {
//         title: String,
//         content: String
//       }
//     ]
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Course", CourseSchema);


const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String },
    price: { type: Number },
    category: { type: String },
    rating: { type: Number },
    duration: { type: String },
    students: { type: Number }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);

