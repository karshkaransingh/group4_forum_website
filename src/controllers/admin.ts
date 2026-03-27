export const getSiteStats = (dependencies: any) => async () => {
  const { mongoDbClient } = dependencies;

  const totalUsers = await mongoDbClient.User.countDocuments();
  const totalPosts = await mongoDbClient.Post.countDocuments();

  return {
    totalUsers,
    totalPosts,
  };
};