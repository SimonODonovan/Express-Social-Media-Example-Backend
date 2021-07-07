import mongoose from "mongoose";
import isURL from "validator/lib/isURL.js";
import { POST_MODEL_NAME, VALIDATION_MESSAGES } from "../constants/postConstants.js";
import { USER_MODEL_NAME } from "../constants/userConstants.js";
import { areValidRefs, isValidRef } from "./validators/generalModelValidators.js";
import { postNotEmpty, isUtcTimestamp, timeStampHasValidContent, arrayContentAreUrls, areValidTags } from "./validators/postModelValidators.js";

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER_MODEL_NAME,
        required: [true, VALIDATION_MESSAGES.USER_REQUIRED],
        validate: [(value) => isValidRef(USER_MODEL_NAME, value), VALIDATION_MESSAGES.USER_NOT_EXIST]
    },
    timestamp: {
        type: String,
        required: [true, VALIDATION_MESSAGES.TIMESTAMP_REQUIRED],
        validate: [
            {
                validator: isUtcTimestamp,
                msg: VALIDATION_MESSAGES.TIMESTAMP_INVALID_FORMAT
            },
            {
                validator: timeStampHasValidContent,
                msg: VALIDATION_MESSAGES.TIMESTAMP_INVALID_CONTENT
            }
        ]
    },
    message: {
        type: String,
        validate: [_validatePostNotEmpty, VALIDATION_MESSAGES.NO_POST_CONTENT],
        minLength: [1, VALIDATION_MESSAGES.MESSAGE_TOO_SHORT],
        maxLength: [280, VALIDATION_MESSAGES.MESSAGE_TOO_LONG]
    },
    files: {
        type: [String],
        default: undefined,
        validate: [
            {
                validator: _validatePostNotEmpty,
                msg: VALIDATION_MESSAGES.NO_POST_CONTENT
            },
            {
                validator: arrayContentAreUrls,
                msg: VALIDATION_MESSAGES.FILES_INVALID_CONTENT
            }
        ]
    },
    link: {
        type: String,
        validate: [
            {
                validator: _validatePostNotEmpty,
                msg: VALIDATION_MESSAGES.NO_POST_CONTENT
            },
            {
                validator: isURL,
                msg: VALIDATION_MESSAGES.LINK_INVALID_CONTENT
            }
        ],
    },
    repost: {
        type: mongoose.Schema.Types.ObjectId,
        ref: POST_MODEL_NAME,
        validate: [(value) => isValidRef(POST_MODEL_NAME, value), VALIDATION_MESSAGES.POST_NOT_EXIST]
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: POST_MODEL_NAME,
        validate: [(value) => isValidRef(POST_MODEL_NAME, value), VALIDATION_MESSAGES.POST_NOT_EXIST]
    },
    mentions: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: USER_MODEL_NAME }],
        default: undefined,
        validate: [(value) => areValidRefs(USER_MODEL_NAME, value), VALIDATION_MESSAGES.USER_NOT_EXIST]
    },
    tags: {
        type: [String],
        default: undefined,
        minLength: [1, VALIDATION_MESSAGES.TAG_TOO_SHORT],
        maxLength: [24, VALIDATION_MESSAGES.TAG_TOO_LONG],
        validate: [areValidTags, VALIDATION_MESSAGES.TAG_INVALID_FORMAT]
    }
});

/**
 * Helper which calls postNotEmpty validator and passes it 
 * the new Post model being saved.
 * @returns {Boolean}   - Boolean new post has required content.
 */
function _validatePostNotEmpty() {
    return postNotEmpty(this);
}

const Post = mongoose.model(POST_MODEL_NAME, postSchema);
export default Post;