const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

const auth = require("../middleware/auth.middleware");

router.post("/", auth, createTask);
router.get("/", auth, getTasks);

module.exports = router;