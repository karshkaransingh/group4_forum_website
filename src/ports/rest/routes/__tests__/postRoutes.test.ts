// supertest allows us to simulate HTTP requests
import request from "supertest";
// express is used to create a test server
import express from "express";
// importing post routes to test API endpoints
import postRoutes from "../post";

// mocking controller functions
jest.mock("../../../../controllers/post", () => ({
  // mock createPost controller
  createPost: () => async () => ({
    _id: "1",
    title: "test",
  }),

  // mock getPosts controller
  getPosts: () => async () => [{ _id: "1", title: "post1" }],

  // mock getPostById controller
  // returns post only if id = 1
  getPostById: () => async (id: string) =>
    id === "1" ? { _id: "1", title: "post1" } : null,

  // mock editPost controller
  editPost: () => async () => ({
    _id: "1",
    title: "updated",
  }),

  // mock deletePost controller
  deletePost: () => async () => true,

  // mock likePost controller
  likePost: () => async () => ({
    likes: 1,
  }),

  // mock addComment controller
  addComment: () => async () => ({
    comments: [{ content: "hi" }],
  }),
}));

// mocking authentication middleware
// so test does not require real JWT token
jest.mock("../../middleware/authentication", () => ({
  authenticateToken: (req: any, _res: any, next: any) => {
    // fake logged-in user
    req.user = {
      userName: "karsh",
      userId: "123",
      isAdmin: true,
    };
    next();
  },
}));

const app = express();
app.use(express.json());
app.use("/api/posts", postRoutes);

// test suite for post routes
describe("post routes", () => {
  // TEST create post route
  it("POST /api/posts creates post", async () => {
    const res = await request(app).post("/api/posts").send({
      title: "test",
      content: "content",
    });

    // check HTTP status
    expect(res.status).toBe(200);
    // check response data
    expect(res.body.title).toBe("test");
  });

  // TEST get all posts route
  it("GET /api/posts returns posts", async () => {
    const res = await request(app).get("/api/posts");

    expect(res.status).toBe(200);
    // response should contain 1 post
    expect(res.body.length).toBe(1);
  });

  // TEST get post by id route
  it("GET /api/posts/:id returns post", async () => {
    const res = await request(app).get("/api/posts/1");

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("post1");
  });

  // TEST 404 when post does not exist
  it("GET /api/posts/:id returns 404 if not found", async () => {
    const res = await request(app).get("/api/posts/999");

    expect(res.status).toBe(404);
  });

  // TEST edit post route
  it("PUT /api/posts/:id edits post", async () => {
    const res = await request(app).put("/api/posts/1").send({
      title: "updated",
      content: "updated",
    });

    expect(res.status).toBe(200);
  });

  // TEST delete post route
  it("DELETE /api/posts/:id deletes post", async () => {
    const res = await request(app).delete("/api/posts/1");

    expect(res.status).toBe(200);
  });

  // TEST like post route
  it("POST /api/posts/:id/like likes post", async () => {
    const res = await request(app).post("/api/posts/1/like");

    expect(res.status).toBe(200);
    // likes should increase
    expect(res.body.likes).toBe(1);
  });

  // TEST add comment route
  it("POST /api/posts/:id/comment adds comment", async () => {
    const res = await request(app).post("/api/posts/1/comment").send({
      content: "hi",
    });

    expect(res.status).toBe(200);
  });
});
