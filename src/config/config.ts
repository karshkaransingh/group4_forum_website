import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.env.PORT || 3000);
const MONGO_URL = process.env.MONGO_URL || "";
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

const config = {
  port: PORT,
  mongoUrl: MONGO_URL,
  jwtSecret: JWT_SECRET,
};

export default config;
