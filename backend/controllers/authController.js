const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Signup
exports.signup = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      ...req.body,
      password: hashedPassword
    });

    await user.save();

    res.json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      "secretkey",
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};