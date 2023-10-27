import { NextApiRequest, NextApiResponse } from "next";
import { connectToDataBase } from "../../../db";
import {Users} from "../../../models/users";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    try {
      await connectToDataBase();  
      res.status(200).json(await Users.find())
    } catch (error: any) {
      console.log(error)
      res.status(400).json({
        trace: {
          ...error
        }
      })
    }
  }