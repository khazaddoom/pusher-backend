import { NextApiRequest, NextApiResponse } from "next";
import "@/db";
import UsersModel from "@/models/user.model";
import RoomsModel from "@/models/room.model";
import { verifyToken } from "../../../utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {method} = req;
    switch (method) {
      case "GET":
        res.status(400).json({message: "Method Not supported!", data: {}})
        break;
      case "POST":
        const {accesstoken} = req.headers;
        const {roomId} = req.body;

        const verifyAuthToken = verifyToken(process.env.AUTH_SECRET as string)
        const {_id, email} = await verifyAuthToken(accesstoken as string)

        const existingUser = await UsersModel.findOne({
          _id, email
        })
        .select('-password -__v')
        .exec()
        if(existingUser) {
          const existingRoom = await RoomsModel.findOne({
            _id: roomId,
            $or: [{
              userId: _id
            }, {
              otherUserId: _id
            }]
          }).select("-__v")
         
          if(existingRoom) {
            let roomDetails = {...existingRoom._doc}
            if(roomDetails.userId != _id) {
              roomDetails = {
                ...roomDetails,
                userId: roomDetails.otherUserId,
                otherUserId: roomDetails.userId
              }
            }
            res.status(200).json({message: "Success", data: {...roomDetails}})
          } else {
            res.status(400).json({message: "Bad Request! No Such room", data: {}})
          }
        } else {
          res.status(403).json({message: "Access Forbidden!", data: {}})
        }
        break;
    }
}