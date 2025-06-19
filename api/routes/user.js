// const router = require("express").Router();
// const express = require("express");
// const multer = require("multer");

// const upload = multer({ storage });
// const {
//     updateUser,
//     deleteUser,
//     getUser,
//     // followUser,
//     // unfollowUser,
//     getUsers,
//     followAndUnfollowUser,
//     editUserDetails
// } = require("../controllers/userController/userController");

// // Routes
// router.put("/:id", updateUser);
// router.delete("/:id", deleteUser);
// router.get("/:id", getUser);
// // router.put("/:id/follow", followUser);
// // router.put("/:id/unfollow", unfollowUser);
// router.put("/:id/followandunfollow", followAndUnfollowUser)
// router.put("/edit/:id", upload.fields([
//     { name: "profilePicture", maxCount: 1 },
//     { name: "coverPicture", maxCount: 1 },
// ]), editUserDetails);

// router.get("/online/getUsers", getUsers);
// module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
    updateUser,
    deleteUser,
    getUser,
    getUsers,
    followAndUnfollowUser,
    editUserDetails,
    getPrifileDetails
} = require("../controllers/userController/userController");

// Setup multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images/");
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + path.extname(file.originalname);
        cb(null, uniqueName);
    },
});
const upload = multer({ storage });

// Route to update profile with optional profile/cover photos
router.put("/edit/:id", upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPicture", maxCount: 1 },
]), editUserDetails);

// Other routes
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/:id", getUser);
router.get("/profile/:id",getPrifileDetails)

router.put("/:id/followandunfollow", followAndUnfollowUser);
router.get("/online/getUsers", getUsers);

module.exports = router;
