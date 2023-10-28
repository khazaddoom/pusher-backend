import { NextApiRequest, NextApiResponse } from "next";
import { connectToDataBase } from "../../../db";
import { Users } from "../../../models";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {method} = req;
  switch (method) {
    case "GET":
      res.status(400).json({message: "Method Not supported!", data: {}})
      break;
    case "POST":
      await connectToDataBase()
      const users = await Users.find({})
      res.status(200).json({message: "Success", data: [...users]})
      break;
  }
}