import { NextApiRequest, NextApiResponse } from "next";
import { connectToDataBase } from "../../../db";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      await connectToDataBase();
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