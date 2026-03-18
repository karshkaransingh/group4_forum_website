import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  content: String,
  author: String
});

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  likes: { type: Number, default: 0 },
  comments: { type: [CommentSchema], default: [] }
});

export const Post = mongoose.model("Post", PostSchema);