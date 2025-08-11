const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    price: { type: Number },
    lessons: [
      {
        title: String,
        content: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);
