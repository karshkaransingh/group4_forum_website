import express from "express";
import {
  createPost,
  getPostById,
  getPosts
} from "../../../controllers/post";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPostById);
router.post("/", createPost);

export default router;