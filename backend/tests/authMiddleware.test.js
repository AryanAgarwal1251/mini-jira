const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/auth.middleware");

// Helper to create mock req/res/next
function mockReqResNext(headers = {}) {
  const req = { headers };
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
  const next = jest.fn();
  return { req, res, next };
}

describe("auth.middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should call next() and set req.user with a valid token", () => {
    const token = jwt.sign({ userId: "user123" }, "secretkey", {
      expiresIn: "1h",
    });

    const { req, res, next } = mockReqResNext({ authorization: token });

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.userId).toBe("user123");
  });

  test("should return 401 if no token is provided", () => {
    const { req, res, next } = mockReqResNext({});

    authMiddleware(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: "No token" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if token is invalid", () => {
    const { req, res, next } = mockReqResNext({
      authorization: "invalid.token.here",
    });

    authMiddleware(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if token is expired", () => {
    // Create an already-expired token
    const token = jwt.sign({ userId: "user123" }, "secretkey", {
      expiresIn: "0s",
    });

    const { req, res, next } = mockReqResNext({ authorization: token });

    // Small delay to ensure expiry
    authMiddleware(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should return 401 if token is signed with wrong secret", () => {
    const token = jwt.sign({ userId: "user123" }, "wrongsecret", {
      expiresIn: "1h",
    });

    const { req, res, next } = mockReqResNext({ authorization: token });

    authMiddleware(req, res, next);

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: "Invalid token" });
    expect(next).not.toHaveBeenCalled();
  });

  test("should decode all payload fields from the token", () => {
    const token = jwt.sign(
      { userId: "abc", role: "admin" },
      "secretkey",
      { expiresIn: "1h" }
    );

    const { req, res, next } = mockReqResNext({ authorization: token });

    authMiddleware(req, res, next);

    expect(req.user.userId).toBe("abc");
    expect(req.user.role).toBe("admin");
  });
});
