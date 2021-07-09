import mongoose from "mongoose";
import { POST_MODEL_NAME } from "../constants/postConstants.js";
import { USER_MODEL_NAME } from "../constants/userConstants.js";
import { LIKE_MODEL_NAME, VALIDATION_MESSAGES } from "../constants/likeConstants.js";
import { isValidRef } from "./validators/generalModelValidators.js";

const likeSchema = new mongoose.Schema({
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: POST_MODEL_NAME,
        required: [true, VALIDATION_MESSAGES.POST_REQUIRED],
        validate: [(value) => isValidRef(POST_MODEL_NAME, value), VALIDATION_MESSAGES.POST_NOT_EXIST]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER_MODEL_NAME,
        required: [true, VALIDATION_MESSAGES.USER_REQUIRED],
        validate: [(value) => isValidRef(USER_MODEL_NAME, value), VALIDATION_MESSAGES.USER_NOT_EXIST]
    },
});

const Like = mongoose.model(LIKE_MODEL_NAME, likeSchema);
export default Like;