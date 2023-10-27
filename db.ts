import mongoose, { ConnectOptions } from "mongoose";
// track the connection
let isConnected = false;
export const connectToDataBase = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    console.log("DB connected already");
    return;
  }
  try {
    const URI = process.env.MONGODB_URI || ""
    await mongoose.connect(URI, {
      dbName: "platform-games",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    isConnected = true;
  } catch (error) {
    console.log(error);
  }
};