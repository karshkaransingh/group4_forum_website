const createUser = async (mongoDbUser: any, userData: any) =>
  new mongoDbUser(userData).save();

const getUserByUserName = async (mongoDbUser: any, userName: string) =>
  mongoDbUser.findOne({ userName });

export default {
  createUser,
  getUserByUserName,
};
