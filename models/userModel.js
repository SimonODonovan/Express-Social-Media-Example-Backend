import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required."],
    },
    username: {
        type: String,
        required: [true, "Username is required."],
    },
    handle: {
        type: String,
        required: [true, "Handle is required."],
        unique: true
    },
    bio:{
        type: String,
    },
    location:{
        type: String,
    },
    avatar:{
        type: String,
    }
});

const User = mongoose.model("User", userSchema);

export default User;