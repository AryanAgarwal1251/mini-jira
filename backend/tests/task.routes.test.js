const request = require("supertest");
const express = require("express");

jest.mock("../controllers/taskController", () => ({
  createTask: jest.fn((req, res) => res.status(201).json({ msg: "task created" })),
  getTasks: jest.fn((req, res) => res.status(200).json({ msg: "tasks fetched" })),
  updateTask: jest.fn((req, res) => res.status(200).json({ msg: "task updated" })),
  deleteTask: jest.fn((req, res) => res.status(200).json({ msg: "task deleted" }))
}));

jest.mock("../middleware/auth.middleware", () => jest.fn((req, res, next) => next()));

const taskRoutes = require("../routes/task.routes");

const app = express();
app.use(express.json());
app.use("/tasks", taskRoutes);

describe("Task Routes", () => {
  it("should fail with invalid task id", async () => {
  const res = await request(app).put("/tasks");
  expect(res.statusCode).not.toBe(200);
});

  it("should route POST / to createTask controller", async () => {
    const res = await request(app).post("/tasks");
    // Since task has two sets of routes (with & without auth), 
    // it will match at least one and perform execution.
    expect(res.statusCode).toBe(201);
    expect(res.body.msg).toBe("task created");
  });
  
  it("should route GET / to getTasks controller", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe("tasks fetched");
  });
  
  it("should route PUT /:id to updateTask controller", async () => {
    const res = await request(app).put("/tasks/123");
    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe("task updated");
  });
  
  it("should route DELETE /:id to deleteTask controller", async () => {
    const res = await request(app).delete("/tasks/123");
    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe("task deleted");
  });
});
