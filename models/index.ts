import mongoose, { mongo } from "mongoose";

interface IUsers extends Document {
    name: string;
}

const UsersSchema = new mongoose.Schema<IUsers>({
    name: { type: String, required: true}
})

const Users = mongoose.model<IUsers>("users", UsersSchema)

export {
    Users
}