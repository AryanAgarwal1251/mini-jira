const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const issueRoutes = require("./routes/issue.routes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/mini-jira");

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/issues", issueRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
