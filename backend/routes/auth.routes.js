const router = require("express").Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const user = await User.findOne(req.body);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user._id }, "SECRET_KEY");
  res.json({ token });
});

module.exports = router;
