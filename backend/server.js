const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const issueRoutes = require("./routes/issue.routes");
const app = express();
app.use(cors());
app.use(express.json());

// docker exec -it mini-jira-mongo mongosh -u admin -p minijira123
// use minijira

mongoose.connect("mongodb://admin:minijira123@localhost:27017/minijira?authSource=admin")
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/issues", issueRoutes);
app.use("/projects", require("./routes/project.routes"));
app.use("/auth", authRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));

const User = require("./models/User");

app.post("/users", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = new User(req.body);
    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const Task = require("./models/Task");

app.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const filter = {
      createdBy: req.user.userId
    };
    
    if (req.query.project) {
      filter.project = new mongoose.Types.ObjectId(req.query.project);
    }

    if (req.query.project) {
      filter.project = new mongoose.Types.ObjectId(req.query.project);
    }

    const tasks = await Task.find(filter)
      .populate("assignedTo", "-password")
      .populate("project");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const Project = require("./models/Project");

// Create project
app.post("/projects", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo")
      .populate("project");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // returns updated document
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});