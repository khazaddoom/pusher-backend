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
        const {roomId, score} = req.body;

        const verifyAuthToken = verifyToken(process.env.AUTH_SECRET as string)
        const {_id, email} = await verifyAuthToken(accesstoken as string)

        const existingUser = await UsersModel.findOne({
          _id, email
        })
        .select('-password -__v')
        .exec()
        if(existingUser) {
          const existingRoom = await RoomsModel.findOne({
            status: {
              $ne: 3
            },
            _id: roomId,
            $or: [{
              userId: _id
            }, {
              otherUserId: _id
            }]
          }).select("-__v")
         
          if(existingRoom) {
            if(existingRoom._doc.userId == _id && !existingRoom._doc.userScore) {
              existingRoom.userScore = score
            }
            if(existingRoom._doc.otherUserId == _id && !existingRoom._doc.otherUserScore) {
              existingRoom.otherUserScore = score
            }
            if(existingRoom.userScore && existingRoom.otherUserScore) {
              if(existingRoom.userScore > existingRoom.otherUserScore) {
                existingRoom.winnerUserId = existingRoom.userId
              }
              if(existingRoom.otherUserScore > existingRoom.userScore) {
                existingRoom.winnerUserId = existingRoom.otherUserId
              }
              if(existingRoom.otherUserScore == existingRoom.userScore) {
                existingRoom.winnerUserId = -1
              }
              existingRoom.status = 3
              existingRoom.completed = true
            }
            await existingRoom.save()
            res.status(200).json({message: "Success", data: {...existingRoom._doc}})
          } else {
            res.status(400).json({message: "Bad Request! No Such room", data: {}})
          }
        } else {
          res.status(403).json({message: "Access Forbidden!", data: {}})
        }
        break;
    }
}