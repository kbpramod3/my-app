const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const middlewareToken = require("../middleware/token")
const router = express.Router();

router.post("/register", async (req, res) => {
  const { username,email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = new User({ username,email, password: hashed });
    await user.save();
    res.json({ message: "User created" });
  } catch (err) {
    res.status(400).json({ error: "Username may already exist" });
  }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: "User not found" });
  
      // Compare hashed password
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: "Invalid password" });
  
      // Create JWT token
      const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
  
      res.json({ token });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  

// ⚠️ DEV ONLY - Get all users
router.get('/users', async (req, res) => {
    try {
      const users = await User.find().select('-password'); // exclude passwords
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  router.get('/me', middlewareToken, async (req, res) => {
    console.log('🙋‍♂️ req.user from token middleware:', req.user);
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  });
  

  

module.exports = router;
