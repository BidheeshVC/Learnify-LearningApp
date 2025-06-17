// controllers/userController/userController.js

const User = require("../../models/User");
const bcrypt = require("bcrypt");

// UPDATE USER
const updateUser = async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Account has been updated");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can update only your account!");
    }
};

// DELETE USER
const deleteUser = async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can delete only your account!");
    }
};

// GET A USER
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        // console.log("User found in getUser:", user);
        user.followers = await Promise.all(user.followers.map((followerId) => User.findById(followerId)));
        user.followings = await Promise.all(user.followings.map((followingId) => User.findById(followingId)));

        const { password, updatedAt, ...other } = user._doc;
        res.status(200).json(other);
        // console.log("User data sent in getUser:", other);
    } catch (err) {
        res.status(500).json(err);
    }
};


// GET A USERS
const getUsers = async (req, res) => {
    console.log("call reached here");
    try {
        const users = await User.find();

        const sanitizedUsers = users.map((user) => {
            const { password, updatedAt, __v, ...other } = user._doc;
            return other;
        });

        // console.log("Sanitized users:", sanitizedUsers);
        res.status(200).json(sanitizedUsers);
    } catch (err) {
        res.status(500).json(err);
    }
};

// FOLLOW USER
const followAndUnfollowUser = async (req, res) => {
    console.log("req body logged in FOLLOW USER & UNFOLLOW USER:", req.body);
    console.log("req params logged in FOLLOW USER & UNFOLLOW USER:", req.params);

    const followingUserId = req.body.userId;
    console.log("Following user ID:123456789-----------------", followingUserId);
    const targetUserId = req.params.id;
    console.log("follower user ID:123456789-----------------", targetUserId);

    if (!followingUserId || !targetUserId) {
        return res.status(400).json("User ID and target ID are required");
    }

    if (followingUserId.toString() === targetUserId.toString()) {
        console.log("Attempted to follow self");
        return res.status(403).json("You can't follow yourself");
    }

    try {
        const user = await User.findById(targetUserId);
        console.log("User found in FOLLOW USER & UNFOLLOW USER :###########################", user);
        const currentUser = await User.findById(followingUserId);
        console.log("Current user found FOLLOW USER & UNFOLLOW USER:###########################", currentUser);

        if (!user.followers.includes(followingUserId)) {
            await user.updateOne({ $push: { followers: followingUserId } });
            await currentUser.updateOne({ $push: { followings: targetUserId } });
            res.status(200).json("User has been followed");
        } else {
            await user.updateOne({ $pull: { followers: followingUserId } });
            await currentUser.updateOne({ $pull: { followings: targetUserId } });
            res.status(200).json("User has been unfollowed");
        }
    } catch (err) {
        res.status(500).json("Error in following And Unfollowing User");
    }
}

// edit profile of user

const editUserDetails = async (req, res) => {
    try {
        const userId = req.params.id;

        console.log("user id from params", userId)

        // Validate the logged-in user is editing their own profile
        if (req.body.userId !== userId) {
            return res.status(403).json("You can update only your own profile.");
        }

        // Build the update object
        const updateData = {
            username: req.body.username,
            desc: req.body.description,
        };
        console.log("update data--------------------------------------------------------------",updateData)

        // Handle optional files
        if (req.files) {
            if (req.files.profilePicture) {
                updateData.profilePicture = req.files.profilePicture[0].filename;
            }

            if (req.files.coverPicture) {
                updateData.coverPicture = req.files.coverPicture[0].filename;
            }
        }

        // Update user in DB
        const updatedUser = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true });
        console.log("updated user ----------------", updatedUser)

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Edit user profile error:", error);
        return res.status(500).json({ message: "Server error during profile update" });
    }
};


// FOLLOW and UNFOLLOW a USER
// const followUser = async (req, res) => {
//     console.log("req body logged:", req.body);
//     console.log("req params logged:", req.params);

//     if (req.body.userId.toString() === req.params.id.toString()) {
//         console.log("Attempted to follow self");
//         return res.status(403).json("You can't follow yourself");
//     }

//     try {
//         const user = await User.findById(req.params.id);
//         console.log("User found:###########################", user);
//         const currentUser = await User.findById(req.body.userId);
//         console.log("Current user found:###########################", currentUser);

//         if (!user.followers.includes(req.body.userId)) {
//             await user.updateOne({ $push: { followers: req.body.userId } });
//             await currentUser.updateOne({ $push: { followings: req.params.id } });
//             res.status(200).json("User has been followed");
//         } else {
//             res.status(403).json("You already follow this user");
//         }
//     } catch (err) {
//         res.status(500).json(err);
//     }
// };


// UNFOLLOW USER
// const unfollowUser = async (req, res) => {
//     console.log("req body logged UNFOLLOW USER***********:", req.body);
//     console.log("req params logged UNFOLLOW USER************:", req.params);
//     if (req.body.userId !== req.params.id) {
//         try {
//             const user = await User.findById(req.params.id);
//             const currentUser = await User.findById(req.body.userId);

//             if (user.followers.includes(req.body.userId)) {
//                 await user.updateOne({ $pull: { followers: req.body.userId } });
//                 await currentUser.updateOne({ $pull: { followings: req.params.id } });
//                 res.status(200).json("User has been unfollowed");
//             } else {
//                 res.status(403).json("You don't follow this user");
//             }
//         } catch (err) {
//             res.status(500).json(err);
//         }
//     } else {
//         res.status(403).json("You can't unfollow yourself");
//     }
// };

module.exports = {
    updateUser,
    deleteUser,
    getUser,
    // followUser,
    // unfollowUser,
    getUsers,
    followAndUnfollowUser,
    editUserDetails
};
