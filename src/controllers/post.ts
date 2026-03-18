import {
  createPostDomain,
  getPostByIdDomain,
  getPostsDomain
} from "../domain/post";

export const createPost = async (req: any, res: any) => {
  try {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
      return res.status(400).json({
        error: "title, content and author are required"
      });
    }

    const post = await createPostDomain(title, content, author);
    res.status(201).json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPosts = async (req: any, res: any) => {
  try {
    const posts = await getPostsDomain();
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getPostById = async (req: any, res: any) => {
  try {
    const post = await getPostByIdDomain(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: "Post not found"
      });
    }

    res.json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};