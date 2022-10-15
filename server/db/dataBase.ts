import mongoose from "mongoose";
import { Log } from "../../utils/console";
import { getAppConfig } from "../AppConfig";

export const connectToMongo = () => {
  const { MONGODB_URI } = getAppConfig();
  mongoose.connect(
    MONGODB_URI,
    {},
    (err) => {
      if (err)  {
        Log("Error connecting to MongoDB", 'critical');
      } else {
        Log("App connected to MongoDB!", 'info');
      }
    }
  );
};