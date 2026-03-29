// db query to create user
const createUser = async (mongoDbUser: any, userData: any) =>
  new mongoDbUser(userData).save();

// db query to get user by name
const getUserByUserName = async (mongoDbUser: any, userName: string) =>
  mongoDbUser.findOne({ userName });

// db query to increase wrong attempts
const increaseWrongAttempts = async (mongoDbUser: any, user: any) => {
  user.wrongLoginAttempts = (user.wrongLoginAttempts || 0) + 1;

  if (user.wrongLoginAttempts >= 3) {
    user.isBlocked = true;
  }

  return user.save();
};

// db query to reset wrong attempts
const resetWrongAttempts = async (mongoDbUser: any, user: any) => {
  user.wrongLoginAttempts = 0;
  user.isBlocked = false;

  return user.save();
};

export default {
  createUser,
  getUserByUserName,
  increaseWrongAttempts,
  resetWrongAttempts,
};
