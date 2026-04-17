// function to get stats
export const getSiteStats = (dependencies: any) => async () => {
  const { mongoDbClient } = dependencies;

  // total users and undeleted posts
  const totalUsers = await mongoDbClient.User.countDocuments();
  const totalPosts = await mongoDbClient.Post.countDocuments({
    isDeleted: false,
  });

  // getting all undeleted posts
  const posts: any[] = await mongoDbClient.Post.find({
    isDeleted: false,
  });

  let totalLikes = 0;
  let totalComments = 0;

  // getting total likes and comments from all posts
  for (const post of posts) {
    totalLikes += post.likes || 0;
    totalComments += post.comments?.length || 0;
  }

  return {
    totalUsers,
    totalPosts,
    totalLikes,
    totalComments,
  };
};
