// supertest to simulate API calls
import request from "supertest";

// express test server
import express from "express";

// route to test
import adminRoutes from "../admin";

// mock controller so DB is not used
jest.mock("../../../../controllers/admin", () => ({
  getSiteStats: () => async () => ({
    totalUsers: 5,
    totalPosts: 2,
    totalLikes: 10,
    totalComments: 3,
  }),
}));

// mock authentication middleware
jest.mock("../../middleware/authentication", () => ({
  // pretend user is logged in
  authenticateToken: (_req: any, _res: any, next: any) => next(),

  // pretend user is admin
  authorizeAdmin: (_req: any, _res: any, next: any) => next(),
}));

// express test app
const app = express();
app.use(express.json());

// mount route
app.use("/api/admin", adminRoutes);

// TEST
describe("admin routes", () => {
  it("GET /api/admin/stats returns stats", async () => {
    const res = await request(app).get("/api/admin/stats");

    expect(res.status).toBe(200);

    expect(res.body).toEqual({
      totalUsers: 5,
      totalPosts: 2,
      totalLikes: 10,
      totalComments: 3,
    });
  });
});
