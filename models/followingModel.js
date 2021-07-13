import mongoose from "mongoose";
import { USER_MODEL_NAME } from "../constants/userConstants.js";
import { FOLLOWING_MODEL_NAME, FOLLOWING_MODEL_FIELDS, VALIDATION_MESSAGES } from "../constants/followingConstants.js";
import { isValidRef } from "./validators/generalModelValidators.js";

const followingSchema = new mongoose.Schema({
    [FOLLOWING_MODEL_FIELDS.FOLLOWER]: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER_MODEL_NAME,
        required: [true, VALIDATION_MESSAGES.FOLLOWER_USER_REQUIRED],
        validate: [(value) => isValidRef(USER_MODEL_NAME, value), VALIDATION_MESSAGES.FOLLOWER_USER_NOT_EXIST]
    },
    [FOLLOWING_MODEL_FIELDS.FOLLOWING]: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER_MODEL_NAME,
        required: [true, VALIDATION_MESSAGES.FOLLOWING_USER_REQUIRED],
        validate: [(value) => isValidRef(USER_MODEL_NAME, value), VALIDATION_MESSAGES.FOLLOWING_USER_NOT_EXIST]
    },
});

const Like = mongoose.model(FOLLOWING_MODEL_NAME, followingSchema);
export default Like;