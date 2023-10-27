// import mongoose, { ConnectOptions } from "mongoose";
// // track the connection
// let isConnected = false;
// export const connectToDataBase = async (MONGODB_URI: string) => {
//   mongoose.set("strictQuery", true);
//   if (isConnected) {
//     console.log("DB connected already");
//     return;
//   }
//   try {
//     await mongoose.connect(MONGODB_URI, {
//       dbName: "platform-games",
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     } as ConnectOptions);
//     isConnected = true;
//   } catch (error) {
//     console.log(error);
//   }
// };


import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise