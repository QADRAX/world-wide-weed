import mongoose from "mongoose";
import { getAppConfig } from "../AppConfig";

export const connectToMongo = () => {
  const { MONGODB_URI } = getAppConfig();
  mongoose.connect(
    MONGODB_URI,
    {},
    (err) => {
      if (err)  {
        console.log("Error connecting to MongoDB");
      } else {
        console.log("App connected to MongoDB!")
      }
    }
  );
};