const request = require("supertest");
const express = require("express");

jest.mock("../controllers/authController", () => ({
  signup: jest.fn((req, res) => res.status(201).json({ status: "signed up" })),
  login: jest.fn((req, res) => res.status(200).json({ status: "logged in" }))
}));

const authRoutes = require("../routes/auth.routes");

const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("Auth Routes", () => {
  it("should route POST /signup to signup controller", async () => {
    const res = await request(app).post("/auth/signup").send({});
    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe("signed up");
  });

  it("should route POST /login to login controller", async () => {
    const res = await request(app).post("/auth/login").send({});
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("logged in");
  });
});
