import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt';

const requestSchema = new Schema({
    song_title: {
        type: String,
        required: true
    },
    artistes: {
        type: Array
    },
    upvotes: {
        type: Number,
        default: 0
    },
    upvotedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    }]
});

const roomSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true
    },
    pin: {
        type: String,
        required: true
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true
    },
    requests: [requestSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

roomSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.pin = await bcrypt.hash(this.pin, salt);
  next();
});

roomSchema.methods.matchPin = async function(enteredPin) {
    return await bcrypt.compare(enteredPin, this.pin);
}

const Room = mongoose.model("Room", roomSchema);

export default Room;
