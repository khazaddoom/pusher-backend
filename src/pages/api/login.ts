import { NextApiRequest, NextApiResponse } from "next";
import { connectToDataBase } from "../../../db";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      const URI = process.env.MONGODB_URI
      
      if(!URI) { 
        res.status(400).json("MongoDB Connection URL is empty!")
        return
      }

      await connectToDataBase(URI);
      res.status(200).json("All OK!")
    } catch (error: any) {
      console.log(error)
      res.status(400).json({
        trace: {
          ...error
        }
      })
    }
    console.log("End!")
  }