import { NextApiRequest, NextApiResponse } from "next";
import "@/db";
import UsersModel from "../../../models/user.model";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {method} = req;
  switch (method) {
    case "GET":
      res.status(400).json({message: "Method Not supported!", data: {}})
      break;
    case "POST":
      const {email, password} = req.body;
      // await connectToDataBase()
      const existingUser = await UsersModel.findOne({
        email
      }).exec()
      if(existingUser) {
        if(password === existingUser.password) {
          const accessToken = "sometoken"
          existingUser.accessToken = accessToken
          await existingUser.save()
          res.status(200).json({message: "Success", data: {
            _id: existingUser._doc._id,
            email: existingUser._doc.email,
            accessToken
          }})
        } else {
          res.status(200).json({message: "Invalid Credentials, Please check inputs", data: {}})
        }
      } else {
        res.status(200).json({message: "User Does not exist, Please Signup", data: {}})
      }
      break;
  }
}