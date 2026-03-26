import express from "express";
import dependencies from "../../../infrastructure/dependencies";
import { authenticateToken } from "../middleware/authentication";
import {
  createPost,
  deletePost,
  editPost,
  getPosts,
  getPostById,
  likePost,
  addComment,
} from "../../../controllers/post";

const router = express.Router();

router.post("/", authenticateToken, async (req: any, res) => {
  try {
    const result = await createPost(dependencies)({
      ...req.body,
      author: req.user.userName,
      authorId: String(req.user.userId),
    });
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (_req: any, res) => {
  const result = await getPosts(dependencies)();
  res.json(result);
});

router.get("/:id", async (req: any, res) => {
  const result = await getPostById(dependencies)(req.params.id);

  if (!result) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.json(result);
});

router.put("/:id", authenticateToken, async (req: any, res) => {
  try {
    const result = await editPost(dependencies)(
      req.params.id,
      req.body,
      req.user,
    );

    if (!result) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", authenticateToken, async (req: any, res) => {
  try {
    await deletePost(dependencies)(req.params.id, req.user);
    res.status(200).json({ message: "Deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/:id/like", authenticateToken, async (req: any, res) => {
  try {
    const result = await likePost(dependencies)(req.params.id, req.user);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/:id/comment", authenticateToken, async (req: any, res) => {
  try {
    const result = await addComment(dependencies)(req.params.id, {
      ...req.body,
      author: req.user.userName,
    });
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export = router;
