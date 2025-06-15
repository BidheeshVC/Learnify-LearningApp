const post = require("../../models/Post");
const Comment = require("../../models/Comment");
const User = require("../../models/User");

// Create a new comment

const createComment = async (req, res) => {

    const postId = req.params.postId;
    console.log("Creating comment for post ID:------------------------------", postId);


    const { userId, text } = req.body;
    console.log("User ID:", userId, "Text:", text);

    if (!userId || !postId || !text) {
        return res.status(400).json({ error: "User ID and text are required." });
    }

    const newComment = new Comment({
        userId: userId,
        postId: postId,
        text: text,
    });
    console.log("New comment object:", newComment);

    try {
        const savedComment = await newComment.save();
        console.log("Comment saved successfully:", savedComment);
        res.status(200).json(savedComment);
    } catch (err) {
        res.status(500).json({ err: "Failed to create comment." });
    }
};

//// Get comments by post ID

const getCommentsByPostId = async (req, res) => {
    const postId = req.params.postId;
    console.log("Fetching comments for post ID:", postId);

    try {
        const comments = await Comment.find({ postId }).sort({ createdAt: -1 });

        if (!comments || comments.length === 0) {
            return res.status(200).json({ comments: [], message: "No comments found for this post." });
        }

        const finalData = await Promise.all(comments.map(async (comment) => {
            const user = await User.findById(comment.userId, 'username profilePicture');

            return {
                _id: comment._id,
                text: comment.text,
                postId: comment.postId,
                userId: comment.userId,
                likes: comment.likes,
                createdAt: comment.createdAt,
                updatedAt: comment.updatedAt,
                username: user?.username || null,
                profilePicture: user?.profilePicture || null,
            };
        }));

        return res.status(200).json({ comments: finalData, message: "Comments fetched successfully." });

    } catch (err) {
        console.error("Error fetching comments:", err);
        res.status(500).json({ error: "Failed to fetch comments." });
    }
};



// const getCommentsByPostId = async (req, res) => {
//     const postId = req.params.postId;
//     console.log("Fetching comments for post ID:", postId);
//     try {
//         const comments = await Comment.find({ postId: postId });
//         console.log("Comments fetched successfully:", comments);
//         res.status(200).json(comments);
//     } catch (err) {
//         res.status(500).json({ error: "Failed to fetch comments." });
//     }
// };


// Delete a comment by ID
const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        console.log("Deleting comment with ID:----------------", commentId);
        // userId = req.body.userId;

        const comment = await Comment.findById(commentId);
        console.log("Comment found:------------------", comment);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found." });
        }
        // Check if the user is authorized to delete the comment
        if (comment.userId !== req.body.userId) {
            return res.status(403).json({ error: "You can only delete your own comments." });
        }
        await Comment.findByIdAndDelete
            (commentId);

        console.log("Comment deleted successfully.");
        res.status(200).json({ message: "Comment deleted successfully." });
    }
    catch (err) {
        console.error("Error deleting comment:", err);
        res.status(500).json({ error: "Failed to delete comment." });
    }
}

// Update a comment by ID

const updateComment = async (req, res) => {
    try {
        console.log("Update comment request received.------------------------", req.body);
        const userId = req.body.userId;
        console.log("User ID for update:", userId);
        const commentId = req.params.id;
        console.log("Updating comment with ID:", commentId);
        const { text } = req.body;
        console.log("text----------", text)

        const comment = await Comment.findById(commentId);
        console.log("Comment found for update:", comment);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found." });
        }
        // Check if the user is authorized to update the comment
        console.log("Comment user ID---------:", comment.userId, "Current user ID-------------:", userId);
        if (comment.userId !== userId) {
            return res.status(403).json({ error: "You can only update your own comments." });
        }
        await Comment.findByIdAndUpdate(commentId, { text: text }, { new: true });

        console.log("Comment updated successfully.");
        res.status(200).json({ message: "Comment updated successfully." });
    } catch (err) {
        console.error("Error updating comment:", err);
        res.status(500).json({ error: "Failed to update comment." });
    }
}





module.exports = {

    createComment,
    getCommentsByPostId,
    deleteComment,
    updateComment,
};
