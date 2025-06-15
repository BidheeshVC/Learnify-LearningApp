// controllers/postController/postController.js

const Comment = require("../../models/Comment");
const Post = require("../../models/Post");
const User = require("../../models/User");

const createPost = async (req, res) => {
    // console.log("request body-----------: ", req.body);
    const newPost = new Post({
        ...req.body,
        tags: req.body.tags || [], // Default empty array if no tags
        emojis: req.body.emojis || [], // Default empty array if no emojis
        location: req.body.location || { lat: 0, long: 0 }, // Default location if not provided
    });
    // console.log("create post--------", newPost)

    try {
        const savedPost = await newPost.save();
        // console.log("saved post-----------", savedPost)
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
};


// UPDATE POST
const updatePost = async (req, res) => {
    console.log("update post request body: ", req.body);
    console.log("update post request params: ", req.params);

    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("The post has been updated");
        } else {
            res.status(403).json("You can update only your post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// DELETE POST
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId.toString() === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("The post has been deleted");
        } else {
            res.status(403).json("You can delete only your post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
};


// LIKE/DISLIKE POST
const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("The post has been liked");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("The post has been disliked");
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

// GET SINGLE POST
const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
};

// GET TIMELINE POSTS
const getTimelinePosts = async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId) =>
                Post.find({ userId: friendId })
            )
        );
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        res.status(500).json(err);
    }
};

// GET ALL POSTS (FEED)
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }); // Sort by newest first
        // const posts = await Post.find();
        // console.log("first posts list", posts)
        const postsWithUserDetails = await Promise.all(
            posts.map(async (post) => {
                const user = await User.findById(post.userId);
                // Fetch all comments for this post
                const comments = await Comment.find({ postId: post._id });
                return {
                    ...post._doc,
                    username: user.username,
                    profilePicture: user.profilePicture,
                    coverPicture: user.coverPicture,
                    commentCount: comments?.length || 0, // Add comment count to the post
                    comments: comments || [], // Include comments in the post
                    createdAt: post.createdAt,

                };
            })
        );
        console.log("posts with user details", postsWithUserDetails)
        res.status(200).json(postsWithUserDetails);
    } catch (err) {
        res.status(500).json(err);
    }
};

// GET USER POSTS BY USERNAME
const getUserPostsByUsername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const posts = await Post.find({ userId: user._id });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
};

// GET USER POSTS BY USER ID
const getUserPostsByUserId = async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.params.id });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
};

// SAVE/UNSAVE POST
const savePost = async (req, res) => {
    const postId = req.params.id;
    const userId = req.body.userId
    console.log("postId in save post", postId)
    console.log("userId in save post", userId)
    try {
        if (!postId || !userId) res.status(500).json("post id and userid required");

        const post = await Post.findById(postId)
        console.log("post in save post", post)
        if (!post) {
            return res.status(404).json({ message: "POST NOT FOUND" })
        }
        if (!post.savedBy.includes(userId)) {
            await post.updateOne({ $push: { savedBy: userId } });
            res.status(200).json("The post has been saved");
        } else {
            console.log("post saved by user else condition::    ", post.savedBy)
            await post.updateOne({ $pull: { savedBy: userId } });
            res.status(200).json("The post has been unsaved");
        }
    } catch (err) {
        console.log("Error in saving post ", err)
        res.status(500).json(err);
    }
}

const getMySavedPosts = async (req, res) => {
    const userId = req.params.id;
    console.log(userId, 'dddddddddddddddddd')

    try {
        const savedPost = await Post.find({ savedBy: userId })
        console.log("saved posts list----", savedPost)

        const postsWithUser = await Promise.all(
            savedPost.map(async (post) => {
                const user = await User.findById(post.userId).select('username profilePicture');
                return {
                    ...post._doc,
                    username: user?.username || "Unknown",
                    profilePicture: user?.profilePicture || "",
                };
            })
        );
        console.log("post with user----------", postsWithUser)
        return res.status(200).json(postsWithUser)

    } catch (err) {
        console.error("Error fetching saved posts", err);
        res.status(500).json(err);
    }
}

module.exports = {
    createPost,
    updatePost,
    deletePost,
    likePost,
    savePost,
    getPost,
    getMySavedPosts,
    getTimelinePosts,
    getAllPosts,
    getUserPostsByUsername,
    getUserPostsByUserId,
};

