import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const MONGO_URL = process.env.MONGO_URL || "";

const config = {
  port: PORT,
  mongoUrl: MONGO_URL,
};

export default config;
