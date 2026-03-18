import { Post } from "../models/post";

export const createPostQuery = async (postData: any) => {
  const post = new Post(postData);
  return await post.save();
};

export const getAllPostsQuery = async () => {
  return await Post.find();
};

export const getPostByIdQuery = async (id: string) => {
  return await Post.findById(id);
};