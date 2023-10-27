import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../db";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      await clientPromise;
      res.status(200).json(process.env.MONGODB_URI)
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