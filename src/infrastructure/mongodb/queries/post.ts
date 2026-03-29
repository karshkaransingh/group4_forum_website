// db query to create post
const createPost = async (mongoDbPost: any, postData: any) =>
  new mongoDbPost(postData).save();

// db query to get post
const getPosts = async (mongoDbPost: any) => mongoDbPost.find();

// db query to get post by id
const getPostById = async (mongoDbPost: any, id: string) =>
  mongoDbPost.findById(id);

// db query to edit post
const updatePost = async (mongoDbPost: any, id: string, data: any) =>
  mongoDbPost.findByIdAndUpdate(id, data, { new: true });

// db query to delete post
const deletePost = async (mongoDbPost: any, id: string) =>
  mongoDbPost.findByIdAndDelete(id);

// db query to save post
const savePost = async (post: any) => post.save();

export default {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  savePost,
};
