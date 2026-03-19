import express from "express";
import dependencies from "../../../infrastructure/dependencies";
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

router.post("/", async (req, res) => {
  try {
    const result = await createPost(dependencies)(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", async (_req, res) => {
  const result = await getPosts(dependencies)();
  res.json(result);
});

router.get("/:id", async (req, res) => {
  const result = await getPostById(dependencies)(req.params.id);
  res.json(result);
});

router.put("/:id", async (req, res) => {
  try {
    const result = await editPost(dependencies)(req.params.id, req.body);

    if (!result) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  await deletePost(dependencies)(req.params.id);
  res.json({ message: "Deleted" });
});

router.post("/:id/like", async (req, res) => {
  const result = await likePost(dependencies)(req.params.id);
  res.json(result);
});

router.post("/:id/comment", async (req, res) => {
  const result = await addComment(dependencies)(req.params.id, req.body);
  res.json(result);
});

export = router;
