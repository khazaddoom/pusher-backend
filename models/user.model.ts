import mongoose, { Schema } from "mongoose";

interface IUsers extends Document {
    fullname: string;
    email: string;
    password: string;
    accessToken: string;
}

const usersSchema = new Schema<IUsers>({
    fullname: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    accessToken: { type: String}
})


const UsersModel = mongoose.models.users || mongoose.model<IUsers>('users', usersSchema);


export default UsersModel