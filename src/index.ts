import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import postRoutes from "./ports/rest/routes/post";
import userRoutes from "./ports/rest/routes/user";
import { connectMongo } from "./infrastructure/mongodb/connection";

const app = express();

dotenv.config();

const desiredPort = Number(process.env.PORT ?? 3000);

console.log("GROUP4:", process.env.MY_NAME);

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

app.use("/api/healthcheck", (_req, res) =>
  res.status(200).json({ message: "Successful" }),
);

app.use("/api/posts", postRoutes);
app.use("/api/user", userRoutes);

connectMongo();

const server = app.listen(desiredPort, () => {
  const addr = server.address();
  const actualPort = typeof addr === "object" && addr ? addr.port : desiredPort;

  console.log(`Server listening on http://localhost:${actualPort}`);
});
