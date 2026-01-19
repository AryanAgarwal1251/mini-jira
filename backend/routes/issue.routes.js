const router = require("express").Router();
const Issue = require("../models/Issue");

router.post("/", async (req, res) => {
  const issue = await Issue.create(req.body);
  res.json(issue);
});

router.get("/:projectId", async (req, res) => {
  const issues = await Issue.find({ projectId: req.params.projectId });
  res.json(issues);
});

router.put("/:id", async (req, res) => {
  const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(issue);
});

module.exports = router;
