import { NextApiRequest, NextApiResponse } from "next";
import "@/db";
import UsersModel from "@/models/user.model";
import { generateToken } from "../../../utils";


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
      })
      .select("-__v")
      .exec()
      if(existingUser) {
        if(password === existingUser.password) {
          const generateAuthToken = generateToken(process.env.AUTH_SECRET as string)
          const accessToken = await generateAuthToken({
            _id: existingUser._doc._id,
            email: existingUser._doc.email
          })
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