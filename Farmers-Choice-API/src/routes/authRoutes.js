const express = require("express");
const router = express.Router();
const { authenticateUser } = require("../middleware/authentication");

// Example placeholder login
router.post("/login", (req, res) => {
  res.send("Login route works!");
});

// Example protected route
router.get("/profile", authenticateUser, (req, res) => {
  res.send("Protected user profile route");
});

module.exports = router;
// Auth routes typically include login and protected profile access.