import express from "express";
import dependencies from "../../../infrastructure/dependencies";
import {
  createPost,
  deletePost,
  editPost,
  getPosts,
  getPostById,
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

export = router;
