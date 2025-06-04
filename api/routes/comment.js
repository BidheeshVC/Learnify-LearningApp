
const router = require("express").Router();
const {
    createComment,
    getCommentsByPostId,
    deleteComment,
    updateComment,
} = require("../controllers/commentController/commentController");

// Routes

router.post("/:postId", createComment); // Create a new comment
router.get("/:postId", getCommentsByPostId); // Get comments by post ID
router.delete("/:id", deleteComment); // Delete a comment by ID
router.put("/:id", updateComment); // Update a comment by ID

module.exports = router;