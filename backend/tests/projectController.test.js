// Mock the Project model
jest.mock("../models/Project");
const Project = require("../models/Project");

const { createProject, getProjects } = require("../controllers/projectController");

// Helper to create mock req/res
function mockReqRes(body = {}, query = {}, params = {}) {
  const req = { body, query, params };
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

// ─── CREATE PROJECT ───────────────────────────────────────

describe("projectController - createProject", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create a project successfully", async () => {
    const projectData = { name: "My Project", description: "A test project" };
    const { req, res } = mockReqRes(projectData);

    const mockSave = jest.fn().mockResolvedValue(true);
    Project.mockImplementation((data) => ({
      ...data,
      save: mockSave,
    }));

    await createProject(req, res);

    expect(mockSave).toHaveBeenCalled();
    expect(res.body).toHaveProperty("name", "My Project");
    expect(res.body).toHaveProperty("description", "A test project");
  });

  test("should return 500 on error", async () => {
    const { req, res } = mockReqRes({ name: "Bad Project" });

    const mockSave = jest.fn().mockRejectedValue(new Error("Save failed"));
    Project.mockImplementation(() => ({ save: mockSave }));

    await createProject(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Save failed" });
  });
});

// ─── GET PROJECTS ─────────────────────────────────────────

describe("projectController - getProjects", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should return all projects with populated createdBy", async () => {
    const mockProjects = [
      { name: "Project 1", createdBy: { name: "User1" } },
      { name: "Project 2", createdBy: { name: "User2" } },
    ];

    // Project.find().populate("createdBy") chain
    Project.find.mockReturnValue({
      populate: jest.fn().mockResolvedValue(mockProjects),
    });

    const { req, res } = mockReqRes();

    await getProjects(req, res);

    expect(Project.find).toHaveBeenCalled();
    expect(res.body).toEqual(mockProjects);
    expect(res.body).toHaveLength(2);
  });

  test("should return 500 on error", async () => {
    Project.find.mockReturnValue({
      populate: jest.fn().mockRejectedValue(new Error("Find failed")),
    });

    const { req, res } = mockReqRes();

    await getProjects(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "Find failed" });
  });
});
