const createPost = async (mongoDbPost: any, postData: any) =>
  new mongoDbPost(postData).save();

const getPosts = async (mongoDbPost: any) => mongoDbPost.find();

const getPostById = async (mongoDbPost: any, id: string) =>
  mongoDbPost.findById(id);

const updatePost = async (mongoDbPost: any, id: string, data: any) =>
  mongoDbPost.findByIdAndUpdate(id, data, { new: true });

const deletePost = async (mongoDbPost: any, id: string) =>
  mongoDbPost.findByIdAndDelete(id);

const savePost = async (post: any) => post.save();

export default {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  savePost,
};
