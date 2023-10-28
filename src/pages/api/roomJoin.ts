import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const {method} = req;
    switch (method) {
      case "GET":
        res.status(400).json({message: "Method Not supported!", data: {}})
        break;
      case "POST":
        res.status(200).json({message: "Success", data: {}})
        break;
    }
}