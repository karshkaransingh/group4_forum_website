import mongoose from "mongoose";

// comment model
const CommentSchema = new mongoose.Schema({
  content: String,
  author: String,
});

// post model
const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  authorId: String,
  likes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] },
  comments: { type: [CommentSchema], default: [] },
  isDeleted: { type: Boolean, default: false },
});

export const Post = mongoose.model("Post", PostSchema);
