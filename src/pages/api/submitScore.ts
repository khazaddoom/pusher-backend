import { NextApiRequest, NextApiResponse } from "next";
import "@/db";
import UsersModel from "@/models/user.model";
import RoomsModel from "@/models/room.model";
import { verifyToken } from "../../../utils";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID as string,
  key: process.env.PUSHER_APP_KEY as string,
  secret: process.env.PUSHER_APP_SECRET as string,
  cluster: "ap2",
  useTLS: true,
});

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
              pusher.trigger(`channel-${existingRoom._doc._id}`, "submit-score", {
                by: existingRoom._doc.userId,
                score: score
              })
            }
            if(existingRoom._doc.otherUserId == _id && !existingRoom._doc.otherUserScore) {
              existingRoom.otherUserScore = score
              pusher.trigger(`channel-${existingRoom._doc._id}`, "submit-score", {
                by: existingRoom._doc.otherUserId,
                score: score
              })
            }
            let winnerDetails = {}
            if(existingRoom.userScore && existingRoom.otherUserScore) {
              if(existingRoom.userScore > existingRoom.otherUserScore) {
                existingRoom.winnerUserId = existingRoom.userId
                winnerDetails = {
                  winnerUserId: existingRoom.userId,
                  winningScore: existingRoom.userScore
                }
              }
              if(existingRoom.otherUserScore > existingRoom.userScore) {
                existingRoom.winnerUserId = existingRoom.otherUserId
                winnerDetails = {
                  winnerUserId: existingRoom.otherUserId,
                  winningScore: existingRoom.otherUserScore
                }
              }
              if(existingRoom.otherUserScore == existingRoom.userScore) {
                existingRoom.winnerUserId = -1
                // tie scenaro
                winnerDetails = {
                  winnerUserId: -1,
                  winningScore: -1
                }
              }
              existingRoom.status = 3
              existingRoom.completed = true
              pusher.trigger(`channel-${existingRoom._doc._id}`, "game-complete", {
                ...winnerDetails
              })
            }
            await existingRoom.save()
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