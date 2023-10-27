// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const Pusher = require("pusher")


const pusher = new Pusher({
  appId: "1695585",
  key: "b4f41a3004c2043c8dae",
  secret: "0857098e038da593883f",
  cluster: "ap2",
  useTLS: true,
});

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const socketId = req.body.socket_id;

  // Replace this with code to retrieve the actual user id and info
  const user = {
    id: "101",
    user_info: {
      name: "John Smith",
    }
  };
  const authResponse = pusher.authenticateUser(socketId, user);

  res.status(200).json({ ...authResponse })
}
