import dotenv from "dotenv";

dotenv.config();

// getting secrets from .env
const PORT = Number(process.env.PORT || 3000);
const MONGO_URL = process.env.MONGO_URL || "";
const JWT_SECRET = process.env.JWT_SECRET || "secret12345_hard_to_find";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const config = {
  port: PORT,
  mongoUrl: MONGO_URL,
  jwtSecret: JWT_SECRET,
  adminUserName: ADMIN_USERNAME,
  adminPassword: ADMIN_PASSWORD,
};

export default config;
