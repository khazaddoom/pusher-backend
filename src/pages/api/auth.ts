// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const Pusher = require("pusher")


const pusher = new Pusher({
  appId: process.env.appId,
  key: process.env.key,
  secret: process.env.secret,
  cluster: "ap2",
  useTLS: true,
});

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const socketId = req.body.socket_id;
  var channelName = req.body.channel_name;
  var auth = pusher.authenticate(socketId, channelName);
  // const authResponse = pusher.authenticateUser(socketId, user);

  res.status(200).json({ ...auth })
}
