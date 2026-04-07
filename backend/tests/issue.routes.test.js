const request = require("supertest");
const express = require("express");

jest.mock("../models/Issue", () => ({
  create: jest.fn().mockResolvedValue({ _id: "1", title: "New Issue generated" }),
  find: jest.fn().mockResolvedValue([{ _id: "1", title: "New Issue list" }]),
  findByIdAndUpdate: jest.fn().mockResolvedValue({ _id: "1", title: "Updated title" })
}));

const Issue = require("../models/Issue");
const issueRoutes = require("../routes/issue.routes");

const app = express();
app.use(express.json());
app.use("/issues", issueRoutes);

describe("Issue Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create an issue when calling POST /", async () => {
    const res = await request(app).post("/issues").send({ title: "New Issue generated" });
    expect(Issue.create).toHaveBeenCalledWith({ title: "New Issue generated" });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("New Issue generated");
  });

  it("should get issues by projectId when calling GET /:projectId", async () => {
    const res = await request(app).get("/issues/proj123");
    expect(Issue.find).toHaveBeenCalledWith({ projectId: "proj123" });
    expect(res.statusCode).toBe(200);
    expect(res.body[0].title).toBe("New Issue list");
  });

  it("should update an issue by id when calling PUT /:id", async () => {
    const res = await request(app).put("/issues/1").send({ title: "Updated title" });
    expect(Issue.findByIdAndUpdate).toHaveBeenCalledWith("1", { title: "Updated title" }, { new: true });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated title");
  });
});
