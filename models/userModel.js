import mongoose from "mongoose";
import { validate as validateEmail } from "isemail";
import { USER_MODEL_NAME, VALIDATION_MESSAGES } from "../constants/userConstants.js";
import { emailInUse, handleInUse, validateHandleWhitespace } from "./validators/userModelValidators.js";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, VALIDATION_MESSAGES.EMAIL_REQUIRED],
        validate: [
            {
                validator: (value) => validateEmail(value, {minDomainAtoms: 2}),
                msg: VALIDATION_MESSAGES.EMAIL_INVALID
            },
            {
                validator: emailInUse,
                msg: VALIDATION_MESSAGES.EMAIL_INUSE
            }
        ],
        unique: true
    },
    password: {
        type: String,
        required: [true, VALIDATION_MESSAGES.PASSWORD_REQUIRED],
    },
    username: {
        type: String,
        required: [true, VALIDATION_MESSAGES.USERNAME_REQUIRED],
        minLength: [4, VALIDATION_MESSAGES.USERNAME_TOO_SHORT],
        maxLength: [50, VALIDATION_MESSAGES.USERNAME_TOO_LONG]
    },
    handle: {
        type: String,
        required: [true, VALIDATION_MESSAGES.HANDLE_REQUIRED],
        minLength: [4, VALIDATION_MESSAGES.HANDLE_TOO_SHORT],
        maxLength: [15, VALIDATION_MESSAGES.HANDLE_TOO_LONG],
        validate: [
            {
                validator: validateHandleWhitespace,
                msg: VALIDATION_MESSAGES.HANDLE_INVALID_WHITESPACE
            },
            {
                validator: handleInUse,
                msg: VALIDATION_MESSAGES.HANDLE_INUSE
            }
        ],
        unique: true
    },
    bio: {
        type: String,
    },
    location: {
        type: String,
    },
    avatar: {
        type: String,
    }
});

const User = mongoose.model(USER_MODEL_NAME, userSchema);

export default User;