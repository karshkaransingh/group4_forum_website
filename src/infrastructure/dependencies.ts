// importing config and mongoDbClient
import config from "../config/config";
import mongoDbClient from "./mongodb/mongoDbClient";

// object that contains both dependencies
const dependencies = {
  config,
  mongoDbClient,
};

// exporting the object to be used throughout the app
export default dependencies;
