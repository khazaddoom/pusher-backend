import { NextApiRequest, NextApiResponse } from "next";
import "@/db"
import UsersModel from "@/models/user.model";
import RoomsModel from "@/models/room.model";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {method} = req;
    switch (method) {
      case "GET":
        res.status(400).json({message: "Method Not supported!", data: {}})
        break;
      case "POST":
        const {accesstoken} = req.headers;
        const {_id, gameType} = req.body;
        const existingUser = await UsersModel.findOne({
          _id,
          accessToken: accesstoken
        })
        .select('-password -__v')
        .exec()
        if(existingUser) {
          const existingRoom = await RoomsModel.findOne({
            status: 1, // Waiting or Inprogress
            gameType,
            $or: [
              {
                userId: {
                  $eq: existingUser._doc._id
                }
              },
              {
                otherUserId: {
                  $eq: existingUser._doc._id
                }
              }
            ]         
          })
          if(!existingRoom) {
            const vacantRoom = await RoomsModel.findOne({
              status: 1,
              gameType,
              $or: [
                {
                  userId: null
                },
                {
                  otherUserId: null
                }
              ]
            })
            if(vacantRoom) {
              // Vacant Room Exists!
              if(!vacantRoom._doc.userId)
                vacantRoom.userId = existingUser._doc._id
              if(!vacantRoom._doc.otherUserId)
                vacantRoom.otherUserId = existingUser._doc._id
              await vacantRoom.save()
              res.status(200).json({...vacantRoom._doc})
            } else {
              const newRoom = await RoomsModel.create({
                gameType: gameType,
                userId: existingUser._doc._id
              })
              res.status(200).json({message: "New Room Creared!", data: {...newRoom._doc}})
            }
          } else {
              res.status(200).json({
                message: "Already Part of a Room!",
                data: { 
                  roomDetails: {...existingRoom._doc}
                }
              })
          }
          
        } else {
          res.status(403).json({message: "Access Forbidden!", data: {}})
        }
        break;
    }
}