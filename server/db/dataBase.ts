import mongoose from "mongoose";
import { Log } from "../utils/console";
import { getAppConfig } from "../AppConfig";

export const connectToMongo = async () => {
  const { MONGODB_URI } = getAppConfig();
  return new Promise<void>((resolve, reject) => {
    mongoose.connect(
      MONGODB_URI,
      {},
      (err) => {
        if (err)  {
          reject(err);
          Log("Error connecting to MongoDB", 'critical');
        } else {
          Log("App connected to MongoDB!", 'info');
          resolve();
        }
      }
    );
  });

};