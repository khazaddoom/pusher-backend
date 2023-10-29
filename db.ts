import mongoose, { ConnectOptions } from "mongoose";
// track the connection
let isConnected = false;
const connectToDataBase = async () => {
  mongoose.set("strictQuery", true);
  if (isConnected) {
    // DB connected already, Lets not do it again!
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
    console.log("Connected!")
  } catch (error) {
    console.log(error);
  }
};
(async () => {
  await connectToDataBase()
})()
