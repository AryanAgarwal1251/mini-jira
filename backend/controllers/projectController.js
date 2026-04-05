const Project = require("../models/Project");

// Create Project
exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("createdBy");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};