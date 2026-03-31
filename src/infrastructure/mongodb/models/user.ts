import mongoose from "mongoose";
const Schema = mongoose.Schema;

// user model
const UserSchema = new Schema({
  userName: { type: String, required: true, unique: true },
  userPassword: { type: String, required: true },

  // role of the user
  role: {
    type: String,
    default: "user",
  },

  // number of wrong attempts
  wrongLoginAttempts: {
    type: Number,
    default: 0,
  },

  // boolean if user is blocked or not
  isBlocked: {
    type: Boolean,
    default: false,
  },

  refreshToken: {
    type: [String],
    default: []
  }

});



export const User = mongoose.model("User", UserSchema);
