import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  content: String,
  author: String
});

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  authorId: String,
  likes: { type: Number, default: 0 },
  likedBy: {type: [String], default: []},
  comments: { type: [CommentSchema], default: [] }
});

export const Post = mongoose.model("Post", PostSchema);