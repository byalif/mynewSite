const express = require("express");
const { verifyToken } = require("../middleware/Verify.js");
const router = express.Router();
const {
  check,
  register,
  authenticate,
  createAccount,
  login,
  followers,
  newFollower,
  resetPassword,
} = require("../controller/auth.js");

router.post("/register", register);
router.post("/createAccount/:token", createAccount);
router.post("/login", login);
router.get("/followers", followers);
router.get("/newFollower", verifyToken, newFollower);
router.post("/resetPassword", resetPassword);
router.get("/", verifyToken, authenticate);

module.exports = router;
