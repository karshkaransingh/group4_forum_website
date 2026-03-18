import {
  createPostQuery,
  getAllPostsQuery,
  getPostByIdQuery
} from "../infrastructure/mongodb/queries/post";

export const createPostDomain = async (
  title: string,
  content: string,
  author: string
) => {
  return await createPostQuery({
    title,
    content,
    author,
    likes: 0,
    comments: []
  });
};

export const getPostsDomain = async () => {
  return await getAllPostsQuery();
};

export const getPostByIdDomain = async (id: string) => {
  return await getPostByIdQuery(id);
};