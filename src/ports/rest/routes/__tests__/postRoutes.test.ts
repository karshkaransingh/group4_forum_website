import request from "supertest";
import express from "express";

import postRoutes from "../post";

jest.mock("../../../../controllers/post", () => ({
  createPost: () => async () => ({
    _id: "1",
    title: "test",
  }),

  getPosts: () => async () => [{ _id: "1", title: "post1" }],

  getPostById: () => async (id: string) =>
    id === "1" ? { _id: "1", title: "post1" } : null,

  editPost: () => async () => ({
    _id: "1",
    title: "updated",
  }),

  deletePost: () => async () => true,

  likePost: () => async () => ({
    likes: 1,
  }),

  addComment: () => async () => ({
    comments: [{ content: "hi" }],
  }),
}));

jest.mock("../../middleware/authentication", () => ({
  authenticateToken: (req: any, _res: any, next: any) => {
    req.user = {
      userName: "krn",
      userId: "123",
      isAdmin: true,
    };
    next();
  },
}));

const app = express();
app.use(express.json());
app.use("/api/posts", postRoutes);

describe("post routes", () => {
  it("POST /api/posts creates post", async () => {
    const res = await request(app).post("/api/posts").send({
      title: "test",
      content: "content",
    });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("test");
  });

  it("GET /api/posts returns posts", async () => {
    const res = await request(app).get("/api/posts");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });

  it("GET /api/posts/:id returns post", async () => {
    const res = await request(app).get("/api/posts/1");

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("post1");
  });

  it("GET /api/posts/:id returns 404 if not found", async () => {
    const res = await request(app).get("/api/posts/999");

    expect(res.status).toBe(404);
  });

  it("PUT /api/posts/:id edits post", async () => {
    const res = await request(app).put("/api/posts/1").send({
      title: "updated",
      content: "updated",
    });

    expect(res.status).toBe(200);
  });

  it("DELETE /api/posts/:id deletes post", async () => {
    const res = await request(app).delete("/api/posts/1");

    expect(res.status).toBe(200);
  });

  it("POST /api/posts/:id/like likes post", async () => {
    const res = await request(app).post("/api/posts/1/like");

    expect(res.status).toBe(200);
    expect(res.body.likes).toBe(1);
  });

  it("POST /api/posts/:id/comment adds comment", async () => {
    const res = await request(app).post("/api/posts/1/comment").send({
      content: "hi",
    });

    expect(res.status).toBe(200);
  });
});