import mongoose, { ConnectOptions } from "mongoose";
// track the connection
let isConnected = false;
export const connectToDataBase = async (MONGODB_URI: string) => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("DB connected already");
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: "platform-games",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    isConnected = true;
  } catch (error) {
    console.log(error);
  }
};