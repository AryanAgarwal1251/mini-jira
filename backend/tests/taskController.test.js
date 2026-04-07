const mongoose = require("mongoose");

// Mock the Task model
jest.mock("../models/Task");
const Task = require("../models/Task");

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// Helper to create mock req/res
function mockReqRes(body = {}, query = {}, params = {}, user = {}) {
  const req = { body, query, params, user };
  const res = {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
  return { req, res };
}

// ─── CREATE TASK ──────────────────────────────────────────

describe("taskController - createTask", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create a task with createdBy from token", async () => {
    const { req, res } = mockReqRes(
      { title: "My Task", description: "Do something" },
      {},
      {},
      { userId: "user123" }
    );

    let constructedWith = null;
    const mockSave = jest.fn().mockResolvedValue(true);
    Task.mockImplementation((data) => {
      constructedWith = data;
      return { ...data, save: mockSave };
    });

    await createTask(req, res);

    expect(mockSave).toHaveBeenCalled();
    expect(constructedWith.createdBy).toBe("user123");
    expect(constructedWith.title).toBe("My Task");
    expect(res.body).toHaveProperty("title", "My Task");
  });

  test("should return 500 on error", async () => {
    const { req, res } = mockReqRes(
      { title: "Bad Task" },
      {},
      {},
      { userId: "user123" }
    );

    Task.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("Save failed")),
    }));

    await createTask(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Save failed" });
  });
});

// ─── GET TASKS ────────────────────────────────────────────

describe("taskController - getTasks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return tasks without project filter", async () => {
    const mockTasks = [{ title: "Task 1" }, { title: "Task 2" }];

    Task.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTasks),
      }),
    });

    const { req, res } = mockReqRes();

    await getTasks(req, res);

    expect(Task.find).toHaveBeenCalledWith({});
    expect(res.body).toEqual(mockTasks);
  });

  test("should filter by project when query param provided", async () => {
    const mockTasks = [{ title: "Filtered Task" }];
    const projectId = "507f1f77bcf86cd799439011";

    Task.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockTasks),
      }),
    });

    const { req, res } = mockReqRes({}, { project: projectId });

    await getTasks(req, res);

    // Verify filter includes ObjectId for project
    const findCall = Task.find.mock.calls[0][0];
    expect(findCall).toHaveProperty("project");
    expect(res.body).toEqual(mockTasks);
  });

  test("should populate assignedTo without password and project", async () => {
    const mockTasks = [];

    const mockPopulateProject = jest.fn().mockResolvedValue(mockTasks);
    const mockPopulateAssigned = jest.fn().mockReturnValue({
      populate: mockPopulateProject,
    });

    Task.find.mockReturnValue({
      populate: mockPopulateAssigned,
    });

    const { req, res } = mockReqRes();

    await getTasks(req, res);

    expect(mockPopulateAssigned).toHaveBeenCalledWith("assignedTo", "-password");
    expect(mockPopulateProject).toHaveBeenCalledWith("project");
  });

  test("should return 500 on error", async () => {
    Task.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error("Query failed")),
      }),
    });

    const { req, res } = mockReqRes();

    await getTasks(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Query failed" });
  });
});

// ─── UPDATE TASK ──────────────────────────────────────────

describe("taskController - updateTask", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should update a task successfully", async () => {
    const updatedTask = { _id: "task1", title: "Updated", status: "done" };

    Task.findByIdAndUpdate.mockResolvedValue(updatedTask);

    const { req, res } = mockReqRes(
      { title: "Updated", status: "done" },
      {},
      { id: "task1" }
    );

    await updateTask(req, res);

    expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(
      "task1",
      { title: "Updated", status: "done" },
      { new: true }
    );
    expect(res.body).toEqual(updatedTask);
  });

  test("should return 500 on error", async () => {
    Task.findByIdAndUpdate.mockRejectedValue(new Error("Update failed"));

    const { req, res } = mockReqRes({ title: "X" }, {}, { id: "bad" });

    await updateTask(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Update failed" });
  });
});

// ─── DELETE TASK ──────────────────────────────────────────

describe("taskController - deleteTask", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should delete a task successfully", async () => {
    Task.findByIdAndDelete.mockResolvedValue({ _id: "task1" });

    const { req, res } = mockReqRes({}, {}, { id: "task1" });

    await deleteTask(req, res);

    expect(Task.findByIdAndDelete).toHaveBeenCalledWith("task1");
    expect(res.body).toEqual({ message: "Task deleted" });
  });

  test("should return 500 on error", async () => {
    Task.findByIdAndDelete.mockRejectedValue(new Error("Delete failed"));

    const { req, res } = mockReqRes({}, {}, { id: "bad" });

    await deleteTask(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Delete failed" });
  });
});
