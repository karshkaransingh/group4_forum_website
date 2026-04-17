// supertest is used to test API routes
import request from "supertest";
// express is used to create a test app
import express from "express";
// importing user routes to test
import userRoutes from "../user";

// mocking bcrypt functions
// so real hashing is not used in tests
jest.mock("bcrypt", () => ({
  genSalt: jest.fn().mockResolvedValue("salt"),
  hash: jest.fn().mockResolvedValue("hashedPassword"),
  compare: jest.fn(),
}));

// mocking jwt verify function
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

// mocking user query functions
// so real database is not used
jest.mock("../../../../infrastructure/mongodb/queries/user", () => ({
  __esModule: true,
  default: {
    createUser: jest.fn(),
    getUserByUserName: jest.fn(),
    increaseWrongAttempts: jest.fn(),
    resetWrongAttempts: jest.fn(),
  },
}));

// mocking authentication middleware and token generators
jest.mock("../../middleware/authentication", () => ({
  authenticateToken: (req: any, _res: any, next: any) => {
    req.user = {
      userName: "karsh",
      userId: "123",
      isAdmin: false,
      role: "user",
    };
    next();
  },
  generateAccessToken: jest.fn().mockReturnValue("fakeAccessToken"),
  generateRefreshToken: jest.fn().mockReturnValue("fakeRefreshToken"),
}));

// importing mocked modules so they can be controlled in tests
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userQueries from "../../../../infrastructure/mongodb/queries/user";

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;
const mockedUserQueries = userQueries as jest.Mocked<typeof userQueries>;

// creating express test app
const app = express();
app.use(express.json());
app.use("/api/user", userRoutes);

// test suite for user routes
describe("user routes", () => {
  // clear previous mock calls before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // TEST create user: missing username
  it("POST /api/user/create should return 400 when userName is missing", async () => {
    const res: any = await request(app).post("/api/user/create").send({
      userPassword: "123456",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("userName and userPassword are required");
  });

  // TEST create user: username already exists
  it("POST /api/user/create should return 400 when username already exists", async () => {
    mockedUserQueries.getUserByUserName.mockResolvedValue({
      userName: "karsh",
    } as any);

    const res: any = await request(app).post("/api/user/create").send({
      userName: "karsh",
      userPassword: "123456",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Username already exists");
  });

  // TEST create user successfully
  it("POST /api/user/create should create user successfully", async () => {
    mockedUserQueries.getUserByUserName.mockResolvedValue(null as any);
    mockedUserQueries.createUser.mockResolvedValue({
      userName: "karsh",
      userPassword: "hashedPassword",
      role: "user",
    } as any);

    const res: any = await request(app).post("/api/user/create").send({
      userName: "karsh",
      userPassword: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body.userName).toBe("karsh");
  });

  // TEST login: missing credentials
  it("POST /api/user/loginJwt should return 400 when credentials are missing", async () => {
    const res: any = await request(app).post("/api/user/loginJwt").send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("userName and userPassword are required");
  });

  // TEST login: user not found
  it("POST /api/user/loginJwt should return 404 when user is not found", async () => {
    mockedUserQueries.getUserByUserName.mockResolvedValue(null as any);

    const res: any = await request(app).post("/api/user/loginJwt").send({
      userName: "karsh",
      userPassword: "123456",
    });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  // TEST login: user blocked
  it("POST /api/user/loginJwt should return 403 when user is blocked", async () => {
    mockedUserQueries.getUserByUserName.mockResolvedValue({
      userName: "sean",
      isBlocked: true,
    } as any);

    const res: any = await request(app).post("/api/user/loginJwt").send({
      userName: "sean",
      userPassword: "123456",
    });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe(
      "User is blocked after 3 wrong password attempts",
    );
  });

  // TEST login: wrong password
  it("POST /api/user/loginJwt should return 400 when password is invalid", async () => {
    mockedUserQueries.getUserByUserName.mockResolvedValue({
      userName: "sean",
      userPassword: "hashedPassword",
      isBlocked: false,
    } as any);

    mockedBcrypt.compare.mockResolvedValue(false as never);

    const res: any = await request(app).post("/api/user/loginJwt").send({
      userName: "sean",
      userPassword: "wrongPassword",
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid password");
  });

  // TEST login success
  it("POST /api/user/loginJwt should login successfully", async () => {
    const fakeUser: any = {
      _id: "123",
      userName: "karsh",
      userPassword: "hashedPassword",
      isBlocked: false,
      role: "user",
      refreshTokens: [],
      save: jest.fn().mockResolvedValue(true),
    };

    mockedUserQueries.getUserByUserName.mockResolvedValue(fakeUser);
    mockedBcrypt.compare.mockResolvedValue(true as never);
    mockedUserQueries.resetWrongAttempts.mockResolvedValue(fakeUser);

    const res: any = await request(app).post("/api/user/loginJwt").send({
      userName: "karsh",
      userPassword: "123456",
    });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBe("fakeAccessToken");
    expect(res.body.refreshToken).toBe("fakeRefreshToken");
    expect(res.body.role).toBe("user");
  });

  // TEST authenticated route
  it("POST /api/user/checkUserAuthenticated should return access message", async () => {
    const res: any = await request(app).post(
      "/api/user/checkUserAuthenticated",
    );

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("user has access");
  });

  // TEST refresh token missing
  it("POST /api/user/refreshToken should return 401 when refresh token is missing", async () => {
    const res: any = await request(app).post("/api/user/refreshToken").send({});

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Refresh token required");
  });

  // TEST refresh token invalid
  it("POST /api/user/refreshToken should return 403 when refresh token is invalid", async () => {
    mockedJwt.verify.mockImplementation(() => {
      throw new Error("invalid");
    });

    const res: any = await request(app).post("/api/user/refreshToken").send({
      refreshToken: "badToken",
    });

    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Invalid refresh token");
  });

  // TEST logout missing refresh token
  it("DELETE /api/user/logout should return 400 when refresh token is missing", async () => {
    const res: any = await request(app).delete("/api/user/logout").send({});

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Refresh token required");
  });

  // TEST logout success
  it("DELETE /api/user/logout success", async () => {
    const dependencies =
      require("../../../../infrastructure/dependencies").default;

    dependencies.mongoDbClient.User.findById = jest.fn().mockResolvedValue({
      _id: "123",
      userName: "karsh",
      refreshTokens: ["validToken"],
      save: jest.fn().mockResolvedValue(true),
    });

    const res: any = await request(app)
      .delete("/api/user/logout")
      .send({ refreshToken: "validToken" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Logout successful");
  });
});
