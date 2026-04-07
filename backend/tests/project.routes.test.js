const request = require("supertest");
const express = require("express");

jest.mock("../controllers/projectController", () => ({
  createProject: jest.fn((req, res) => res.status(201).json({ msg: "project created" })),
  getProjects: jest.fn((req, res) => res.status(200).json({ msg: "projects fetched" }))
}));

const projectRoutes = require("../routes/project.routes");

const app = express();
app.use(express.json());
app.use("/projects", projectRoutes);

describe("Project Routes", () => {
  it("should route POST / to createProject controller", async () => {
    const res = await request(app).post("/projects").send({});
    expect(res.statusCode).toBe(201);
    expect(res.body.msg).toBe("project created");
  });

  it("should route GET / to getProjects controller", async () => {
    const res = await request(app).get("/projects");
    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe("projects fetched");
  });
});
