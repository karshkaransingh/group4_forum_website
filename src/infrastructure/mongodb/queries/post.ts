// db query to create post
const createPost = async (mongoDbPost: any, postData: any) =>
  new mongoDbPost(postData).save();

// db query to get post
const getPosts = async (mongoDbPost: any) =>
  mongoDbPost.find({ isDeleted: false });

// db query to get post by id
const getPostById = async (mongoDbPost: any, id: string) =>
  mongoDbPost.findOne({ _id: id, isDeleted: false });

// db query to edit post
const updatePost = async (mongoDbPost: any, id: string, data: any) =>
  mongoDbPost.findByIdAndUpdate(id, data, { new: true });

// db query to delete post
const deletePost = async (mongoDbPost: any, id: string) =>
  mongoDbPost.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

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
