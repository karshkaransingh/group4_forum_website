// // function to validate inputs while creating post
export const validateCreatePost = (data: any) => {
  // getting data
  const { title, content, author, authorId } = data;

  // if any of the inputs are empty
  if (!title || !content || !author) {
    throw new Error("title, content and author are required");
  }

  // otherwise return
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
  // getting data
  const { title, content } = data;

  // if any of the inputs are empty
  if (!title || !content) {
    throw new Error("title and content are required");
  }

  // otherwise return
  return { title, content };
};

// // function to validate inputs while commenting on post
export const validateComment = (data: any) => {
  // getting data
  const { content, author } = data;

  // if any of the inputs are empty
  if (!content || !author) {
    throw new Error("content and author are required");
  }

  // otherwise return
  return { content, author };
};
