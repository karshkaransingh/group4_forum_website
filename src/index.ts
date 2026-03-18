import express from "express";
import cors from "cors";
import path from "path";
import config from "./config/config";
import { connectMongo } from "./infrastructure/mongodb/connection";
import { dependencies } from "./infrastructure/dependencies";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/posts", dependencies.postRoutes);

app.get("/healthcheck", (req, res) => {
  res.json({ message: "Successful" });
});

const startServer = async () => {
  await connectMongo();

  app.listen(config.port, () => {
    console.log(Server running on port ${config.port});
  });
};

startServer();