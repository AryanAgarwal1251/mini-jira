const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    req.user = jwt.verify(token, "SECRET_KEY");
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
