import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userName: { type: String, required: true, unique: true },
  userPassword: { type: String, required: true },
});

export const User = mongoose.model("User", UserSchema);
