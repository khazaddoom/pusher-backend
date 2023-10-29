import { NextApiRequest, NextApiResponse } from "next";
import "@/db"
import UsersModel from "@/models/user.model";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {method} = req;
    switch (method) {
      case "GET":
        res.status(400).json({message: "Method Not supported!", data: {}})
        break;
      case "POST":
        const {accesstoken} = req.headers;
        const {_id} = req.body;
        const existingUser = await UsersModel.findOne({
          _id,
          accessToken: accesstoken
        })
        .select('-password -_id -__v')
        .exec()
        if(existingUser) {
          res.status(200).json({message: "Success", data: {...existingUser._doc}})
        } else {
          res.status(403).json({message: "Access Forbidden!", data: {}})
        }
        break;
    }
}