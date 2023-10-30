import mongoose, { Schema } from "mongoose";

interface IRooms extends Document {
    gameType: number;
    userId: string;
    otherUserId: string;
    status: number // 1 - WAITING, 2 - GAME_INPROGRESS, 3 - COMPLETED
    completed: boolean,
    userScore: number,
    otherUserScore: number,
    winnerUserId: string
}

const roomsSchema = new Schema<IRooms>({
    gameType: { type: Number, required: true},
    userId: { type: String, required: false},
    otherUserId: { type: String, required: false},
    status: { type: Number, required: true, default: 1},
    userScore: { type: Number, required: false},
    otherUserScore: { type: Number, required: false},
    winnerUserId: { type: String, required: false},
    completed: { type: Boolean, default: false}
})


const RoomsModel = mongoose.models.rooms || mongoose.model<IRooms>('rooms', roomsSchema);


export default RoomsModel