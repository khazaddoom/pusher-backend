import mongoose, { Model } from "mongoose";

interface IUsers extends Document {
    fullname: string;
    email: string;
    password: string;
    accessToken: string;
}

const Users = mongoose.model("users")  || mongoose.model<IUsers>("users", new mongoose.Schema<IUsers>({
    fullname: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    accessToken: { type: String}
}))

export {
    Users
}