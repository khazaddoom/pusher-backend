import mongoose from "mongoose";

const Users = mongoose.model("users", {
    name: String
})

export {
    Users
}