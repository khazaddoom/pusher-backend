import { NextApiRequest, NextApiResponse } from "next";
import { connectToDataBase } from "@/db";
import { Users } from "@/models";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {method} = req;
    switch (method) {
      case "GET":
        res.status(400).json({message: "Method Not supported!", data: {}})
        break;
      case "POST":
        const {email, password, fullname} = req.body;
        await connectToDataBase()
        const existingUser = await Users.findOne({
          email
        }).exec()
        if(existingUser)
          res.status(200).json({message: "User Exists, Please login", data: {}})
        else {
          const newUser = await Users.create({
            email,
            password,
            fullname
          })
          const {_id} = newUser._doc
          res.status(200).json({message: "User Created!", data: {_id}})
        }
        break;
    }
}