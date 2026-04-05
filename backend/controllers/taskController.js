const Task = require("../models/Task");
const mongoose = require("mongoose");

// Create Task
exports.createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      createdBy: req.user.userId   // 🔥 from token
    });

    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Tasks (with filter)
exports.getTasks = async (req, res) => {
  try {
    const filter = {};

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
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};