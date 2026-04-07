const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Mock the User model
jest.mock("../models/User");
const User = require("../models/User");

const { signup, login } = require("../controllers/authController");

// Helper to create mock req/res
function mockReqRes(body = {}) {
  const req = { body };
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

// ─── SIGNUP ───────────────────────────────────────────────

describe("authController - signup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create a new user successfully", async () => {
    const { req, res } = mockReqRes({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    User.findOne.mockResolvedValue(null);

    const mockSave = jest.fn().mockResolvedValue(true);
    User.mockImplementation(() => ({ save: mockSave }));

    await signup(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
    expect(mockSave).toHaveBeenCalled();
    expect(res.body).toEqual({ message: "User created" });
  });

  test("should return 400 if user already exists", async () => {
    const { req, res } = mockReqRes({
      email: "existing@example.com",
      password: "password123",
    });

    User.findOne.mockResolvedValue({ email: "existing@example.com" });

    await signup(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "User already exists" });
  });

  test("should return 500 on internal error", async () => {
    const { req, res } = mockReqRes({
      email: "test@example.com",
      password: "password123",
    });

    User.findOne.mockRejectedValue(new Error("DB connection failed"));

    await signup(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "DB connection failed" });
  });

  test("should hash the password with bcrypt before saving", async () => {
    const { req, res } = mockReqRes({
      name: "Test User",
      email: "new@example.com",
      password: "mypassword",
    });

    User.findOne.mockResolvedValue(null);

    let constructedWith = null;
    const mockSave = jest.fn().mockResolvedValue(true);
    User.mockImplementation((data) => {
      constructedWith = data;
      return { save: mockSave };
    });

    await signup(req, res);

    // Password should be hashed, not plain text
    expect(constructedWith.password).not.toBe("mypassword");
    // Verify bcrypt hash
    const isMatch = await bcrypt.compare("mypassword", constructedWith.password);
    expect(isMatch).toBe(true);
  });

  test("should spread req.body fields into the user", async () => {
    const { req, res } = mockReqRes({
      name: "SpreadTest",
      email: "spread@test.com",
      password: "pass123",
    });

    User.findOne.mockResolvedValue(null);

    let constructedWith = null;
    User.mockImplementation((data) => {
      constructedWith = data;
      return { save: jest.fn().mockResolvedValue(true) };
    });

    await signup(req, res);

    expect(constructedWith.name).toBe("SpreadTest");
    expect(constructedWith.email).toBe("spread@test.com");
  });
});

// ─── LOGIN ────────────────────────────────────────────────

describe("authController - login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should login successfully with valid credentials", async () => {
    const hashedPassword = await bcrypt.hash("correctpassword", 10);

    const { req, res } = mockReqRes({
      email: "user@example.com",
      password: "correctpassword",
    });

    User.findOne.mockResolvedValue({
      _id: "user123",
      email: "user@example.com",
      password: hashedPassword,
    });

    await login(req, res);

    expect(res.body).toHaveProperty("token");
    // Verify the token contains the right userId
    const decoded = jwt.verify(res.body.token, "secretkey");
    expect(decoded.userId).toBe("user123");
  });

  test("should return 400 if user not found", async () => {
    const { req, res } = mockReqRes({
      email: "nonexistent@example.com",
      password: "password123",
    });

    User.findOne.mockResolvedValue(null);

    await login(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Invalid credentials" });
  });

  test("should return 400 if password does not match", async () => {
    const hashedPassword = await bcrypt.hash("correctpassword", 10);

    const { req, res } = mockReqRes({
      email: "user@example.com",
      password: "wrongpassword",
    });

    User.findOne.mockResolvedValue({
      _id: "user123",
      email: "user@example.com",
      password: hashedPassword,
    });

    await login(req, res);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Invalid credentials" });
  });

  test("should return 500 on internal error", async () => {
    const { req, res } = mockReqRes({
      email: "user@example.com",
      password: "password123",
    });

    User.findOne.mockRejectedValue(new Error("DB error"));

    await login(req, res);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error: "DB error" });
  });

  test("should create token with 1h expiry", async () => {
    const hashedPassword = await bcrypt.hash("pass", 10);
    const { req, res } = mockReqRes({
      email: "user@example.com",
      password: "pass",
    });

    User.findOne.mockResolvedValue({
      _id: "uid1",
      email: "user@example.com",
      password: hashedPassword,
    });

    await login(req, res);

    const decoded = jwt.verify(res.body.token, "secretkey");
    // Token should have exp field (expiry)
    expect(decoded).toHaveProperty("exp");
    // exp - iat should be 3600 (1 hour)
    expect(decoded.exp - decoded.iat).toBe(3600);
  });
});
