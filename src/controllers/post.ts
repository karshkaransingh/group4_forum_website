import postQueries from "../infrastructure/mongodb/queries/post";
import { validateCreatePost, validateEditPost } from "../domain/post";

export const createPost = (dependencies: any) => async (data: any) => {
  const { mongoDbClient } = dependencies;
  const Post = mongoDbClient.Post;

  const valid = validateCreatePost(data);
  return await postQueries.createPost(Post, valid);
};

export const getPosts = (dependencies: any) => async () => {
  const { mongoDbClient } = dependencies;
  return await postQueries.getPosts(mongoDbClient.Post);
};

export const getPostById = (dependencies: any) => async (id: string) => {
  const { mongoDbClient } = dependencies;
  return await postQueries.getPostById(mongoDbClient.Post, id);
};

export const editPost =
  (dependencies: any) => async (id: string, data: any) => {
    const { mongoDbClient } = dependencies;
    const valid = validateEditPost(data);

    return await postQueries.updatePost(mongoDbClient.Post, id, valid);
  };

export const deletePost = (dependencies: any) => async (id: string) => {
  const { mongoDbClient } = dependencies;
  return await postQueries.deletePost(mongoDbClient.Post, id);
};
