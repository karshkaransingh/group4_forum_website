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

// route to create post (accessed by authenticated users)
router.post("/", authenticateToken, async (req: any, res) => {
  try {
    // calling controller to create the post
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

// route to get posts (accessed by everyone)
router.get("/", async (_req: any, res) => {
  // calling controller to get all posts
  const result = await getPosts(dependencies)();
  res.json(result);
});

// route to get post by id (accessed by everyone)
router.get("/:id", async (req: any, res) => {
  // calling controller to create the post by id
  const result = await getPostById(dependencies)(req.params.id);

  if (!result) {
    return res.status(404).json({ error: "Post not found" });
  }
  res.json(result);
});

// route to edit posts (accessed by authenticated users)
router.put("/:id", authenticateToken, async (req: any, res) => {
  try {
    // calling controller to edit the post
    const result = await editPost(dependencies)(
      req.params.id,
      req.body,
      req.user,
    );

    // if no result found
    if (!result) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// route to delete posts (accessed by authenticated users)
router.delete("/:id", authenticateToken, async (req: any, res) => {
  try {
    // calling controller to delete the post
    await deletePost(dependencies)(req.params.id, req.user);
    res.status(200).json({ message: "Deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// route to like posts (accessed by authenticated users)
router.post("/:id/like", authenticateToken, async (req: any, res) => {
  try {
    // calling controller to like the post
    const result = await likePost(dependencies)(req.params.id, req.user);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// route to comment on posts (accessed by authenticated users)
router.post("/:id/comment", authenticateToken, async (req: any, res) => {
  try {
    // calling controller to add comment to the post
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
