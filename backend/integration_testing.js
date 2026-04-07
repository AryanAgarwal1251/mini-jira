const request = require("supertest");
const app = require("../app");

describe("Auth + Task Integration", () => {
  let token;

  it("should login and return token", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ email: "test@mail.com", password: "123456" });

    token = res.body.token;
    expect(token).toBeDefined();
  });

  it("should create task with valid token", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Task" });

    expect(res.statusCode).toBe(201);
  });
});