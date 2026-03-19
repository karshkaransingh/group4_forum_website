import { connect as connection } from "mongoose";
import config from "../../config/config";

export const connectMongo = async () => {
  try {
    await connection(config.mongoUrl);
    console.log("MONGODB CONNECTION PASSED");
  } catch (error) {
    console.log("MONGODB CONNECTION FAILED", error);
  }
};
