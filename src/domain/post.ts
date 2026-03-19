export const validateCreatePost = (data: any) => {
  const { title, content, author } = data;

  if (!title || !content || !author) {
    throw new Error("title, content and author are required");
  }

  return {
    title,
    content,
    author,
    likes: 0,
    comments: [],
  };
};

export const validateEditPost = (data: any) => {
  const { title, content } = data;

  if (!title || !content) {
    throw new Error("title and content are required");
  }

  return { title, content };
};

export const validateComment = (data: any) => {
  const { content, author } = data;

  if (!content || !author) {
    throw new Error("content and author are required");
  }

  return { content, author };
};