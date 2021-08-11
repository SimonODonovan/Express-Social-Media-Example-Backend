import mongoose from "mongoose";
import { validate as validateEmail } from "isemail";
import { USER_MODEL_NAME, VALIDATION_MESSAGES, USER_MODEL_FIELDS } from "../constants/userConstants.js";
import { emailInUse, handleInUse, validateHandleWhitespace } from "./validators/userModelValidators.js";

const userSchema = new mongoose.Schema({
    [USER_MODEL_FIELDS.EMAIL]: {
        type: String,
        required: [true, VALIDATION_MESSAGES.EMAIL_REQUIRED],
        validate: [
            {
                validator: (value) => validateEmail(value, { minDomainAtoms: 2 }),
                msg: VALIDATION_MESSAGES.EMAIL_INVALID
            },
            {
                validator: emailInUse,
                msg: VALIDATION_MESSAGES.EMAIL_INUSE
            }
        ],
        unique: true
    },
    [USER_MODEL_FIELDS.PASSWORD]: {
        type: String,
        required: [true, VALIDATION_MESSAGES.PASSWORD_REQUIRED],
        minLength: [8, VALIDATION_MESSAGES.PASSWORD_TOO_SHORT],
    },
    [USER_MODEL_FIELDS.USERNAME]: {
        type: String,
        required: [true, VALIDATION_MESSAGES.USERNAME_REQUIRED],
        minLength: [4, VALIDATION_MESSAGES.USERNAME_TOO_SHORT],
        maxLength: [50, VALIDATION_MESSAGES.USERNAME_TOO_LONG]
    },
    [USER_MODEL_FIELDS.HANDLE]: {
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
    [USER_MODEL_FIELDS.BIO]: {
        type: String,
    },
    [USER_MODEL_FIELDS.LOCATION]: {
        type: String,
    },
    [USER_MODEL_FIELDS.AVATAR]: {
        type: String,
    }
});

const User = mongoose.model(USER_MODEL_NAME, userSchema);

export default User;