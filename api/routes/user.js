const router = require("express").Router();
const {
    updateUser,
    deleteUser,
    getUser,
    followUser,
    unfollowUser,
    getUsers,
} = require("../controllers/userController/userController");

// Routes
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.get("/:id", getUser);
router.put("/:id/follow", followUser);
router.put("/:id/unfollow", unfollowUser);

router.get("/online/getUsers", getUsers);
module.exports = router;
