import postQueries from "../infrastructure/mongodb/queries/post";
import {
  validateCreatePost,
  validateEditPost,
  validateComment,
} from "../domain/post";

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
  (dependencies: any) => async (id: string, data: any, user: any) => {
    const { mongoDbClient } = dependencies;
    const Post = mongoDbClient.Post;

    const post = await postQueries.getPostById(Post, id);

    if (!post) {
      throw new Error("Post not found");
    }

    if (String(post.authorId) !== String(user.userId)) {
      throw new Error("You can only edit your own post");
    }

    const valid = validateEditPost(data);

    return await postQueries.updatePost(mongoDbClient.Post, id, valid);
  };

export const deletePost =
  (dependencies: any) => async (id: string, user: any) => {
    const { mongoDbClient } = dependencies;
    const Post = mongoDbClient.Post;

    const post = await postQueries.getPostById(Post, id);

    if (!post) {
      throw new Error("Post not found");
    }

    if (String(post.authorId) !== String(user.userId)) {
      throw new Error("You can only delete your own post");
    }

    return await postQueries.deletePost(mongoDbClient.Post, id);
  };

export const likePost =
  (dependencies: any) => async (id: string, user: any) => {
    const { mongoDbClient } = dependencies;

    const post = await postQueries.getPostById(mongoDbClient.Post, id);

    if (!post) throw new Error("Post not found");

    const userId = user.userId;

    if (!post.likedBy) {
      post.likedBy = [];
    }

    if (post.likedBy.includes(userId)) {
      throw new Error("You cannot like twice");
    }

    post.likes = (post.likes || 0) + 1;

    post.likedBy.push(userId);

    return await postQueries.savePost(post);
  };

export const addComment =
  (dependencies: any) => async (id: string, data: any) => {
    const { mongoDbClient } = dependencies;

    const post = await postQueries.getPostById(mongoDbClient.Post, id);
    if (!post) throw new Error("Post not found");

    const valid = validateComment(data);

    post.comments.push(valid);

    return await postQueries.savePost(post);
  };
