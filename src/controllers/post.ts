import postQueries from "../infrastructure/mongodb/queries/post";
import {
  validateCreatePost,
  validateEditPost,
  validateComment,
} from "../domain/post";

// function to create post
export const createPost = (dependencies: any) => async (data: any) => {
  const { mongoDbClient } = dependencies;
  const Post = mongoDbClient.Post;

  // validating the post before creation
  const valid = validateCreatePost(data);

  // creating post in DB using post queries
  return await postQueries.createPost(Post, valid);
};

// function to get all posts
export const getPosts = (dependencies: any) => async () => {
  const { mongoDbClient } = dependencies;

  // getting post from DB using post queries
  return await postQueries.getPosts(mongoDbClient.Post);
};

// function to get post by id
export const getPostById = (dependencies: any) => async (id: string) => {
  const { mongoDbClient } = dependencies;

  // getting post from DB using post queries
  return await postQueries.getPostById(mongoDbClient.Post, id);
};

// function to edit post
export const editPost =
  (dependencies: any) => async (id: string, data: any, user: any) => {
    const { mongoDbClient } = dependencies;
    const Post = mongoDbClient.Post;

    // getting post from DB using post queries
    const post = await postQueries.getPostById(Post, id);

    // if post not found
    if (!post) {
      throw new Error("Post not found");
    }

    // if user is not admin and not post owner he cannot edit the post
    if (
      !user.isAdmin &&
      user.role !== "superuser" &&
      String(post.authorId) !== String(user.userId)
    ) {
      throw new Error("You can only edit your own post");
    }

    // validating the post before editing
    const valid = validateEditPost(data);

    // updating the pre existing post in DB using post queries
    return await postQueries.updatePost(mongoDbClient.Post, id, valid);
  };

// function to delete post
export const deletePost =
  (dependencies: any) => async (id: string, user: any) => {
    const { mongoDbClient } = dependencies;
    const Post = mongoDbClient.Post;

    // getting post from DB using post queries
    const post = await postQueries.getPostById(Post, id);

    // if post not found
    if (!post) {
      throw new Error("Post not found");
    }

    // if user is not admin and not post owner he cannot delete the post
    if (
      !user.isAdmin &&
      user.role !== "superuser" &&
      String(post.authorId) !== String(user.userId)
    ) {
      throw new Error("You can only delete your own post");
    }

    // deleting the pre existing post in DB using post queries
    return await postQueries.deletePost(mongoDbClient.Post, id);
  };

// function to like post
export const likePost =
  (dependencies: any) => async (id: string, user: any) => {
    const { mongoDbClient } = dependencies;

    // getting post from DB using post queries
    const post = await postQueries.getPostById(mongoDbClient.Post, id);

    // if post not found
    if (!post) {
      throw new Error("Post not found");
    }

    // getting the current user's id
    const userId = user.userId;

    // safe way to get the likedBy list
    if (!post.likedBy) {
      post.likedBy = [];
    }

    // if user already liked the post; he cannot like it twice
    if (post.likedBy.includes(userId)) {
      throw new Error("You cannot like twice");
    }

    // increase the number of likes by 1
    post.likes = (post.likes || 0) + 1;

    // push the user into likedBy list
    post.likedBy.push(userId);

    // saving the post with new changed in DB using post queries
    return await postQueries.savePost(post);
  };

// function to comment on post
export const addComment =
  (dependencies: any) => async (id: string, data: any) => {
    const { mongoDbClient } = dependencies;

    // getting post from DB using post queries
    const post = await postQueries.getPostById(mongoDbClient.Post, id);

    // if post not found
    if (!post) {
      throw new Error("Post not found");
    }

    // validating the comment before adding to the post
    const valid = validateComment(data);

    // pushing the comment to the post
    post.comments.push(valid);

    // saving the post with new changed in DB using post queries
    return await postQueries.savePost(post);
  };
