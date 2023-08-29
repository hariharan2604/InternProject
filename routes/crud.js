const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const userController = new UserController();

router.post("/register", userController.createUser);
router.post("/login", userController.authUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.get("/filter/:branch", userController.getUsersByBranch);
router.put("/update/:id", userController.updateUser);
router.get("/type/:id", userController.getUserType);
// router.get("/update/:id", userController.getUserById);
router.delete("/delete/:id", userController.deleteUserWithCredential);

module.exports = router;
