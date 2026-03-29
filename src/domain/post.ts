// // function to validate inputs while creating post
export const validateCreatePost = (data: any) => {
  const { title, content, author, authorId } = data;

  if (!title || !content || !author) {
    throw new Error("title, content and author are required");
  }

  return {
    title,
    content,
    author,
    authorId,
    likes: 0,
    comments: [],
  };
};

// // function to validate inputs while editing post
export const validateEditPost = (data: any) => {
  const { title, content } = data;

  if (!title || !content) {
    throw new Error("title and content are required");
  }

  return { title, content };
};

// // function to validate inputs while commenting on post
export const validateComment = (data: any) => {
  const { content, author } = data;

  if (!content || !author) {
    throw new Error("content and author are required");
  }

  return { content, author };
};
