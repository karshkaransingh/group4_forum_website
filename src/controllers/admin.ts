export const getSiteStats = (dependencies: any) => async () => {
  const { mongoDbClient } = dependencies;

  const totalUsers = await mongoDbClient.User.countDocuments();
  const totalPosts = await mongoDbClient.Post.countDocuments();

  const posts: any[] = await mongoDbClient.Post.find();

  let totalLikes = 0;
  let totalComments = 0;

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
