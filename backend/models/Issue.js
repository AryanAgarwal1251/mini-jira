const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    enum: ["Backlog", "Ready", "In Progress", "In Review", "Done"],
    default: "Backlog"
  },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project" }
});

module.exports = mongoose.model("Issue", issueSchema);
