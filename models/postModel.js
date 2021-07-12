import mongoose from "mongoose";
import isURL from "validator/lib/isURL.js";
import { POST_MODEL_NAME, VALIDATION_MESSAGES, POST_MODEL_FIELDS } from "../constants/postConstants.js";
import { USER_MODEL_NAME } from "../constants/userConstants.js";
import { areValidRefs, isValidRef } from "./validators/generalModelValidators.js";
import { postNotEmpty, isUtcTimestamp, timeStampHasValidContent, arrayContentAreUrls, areValidTags } from "./validators/postModelValidators.js";

const postSchema = new mongoose.Schema({
    [POST_MODEL_FIELDS.USER]: {
        type: mongoose.Schema.Types.ObjectId,
        ref: USER_MODEL_NAME,
        required: [true, VALIDATION_MESSAGES.USER_REQUIRED],
        validate: [(value) => isValidRef(USER_MODEL_NAME, value), VALIDATION_MESSAGES.USER_NOT_EXIST]
    },
    [POST_MODEL_FIELDS.TIMESTAMP]: {
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
    [POST_MODEL_FIELDS.MESSAGE]: {
        type: String,
        validate: [_validatePostNotEmpty, VALIDATION_MESSAGES.NO_POST_CONTENT],
        minLength: [1, VALIDATION_MESSAGES.MESSAGE_TOO_SHORT],
        maxLength: [280, VALIDATION_MESSAGES.MESSAGE_TOO_LONG]
    },
    [POST_MODEL_FIELDS.FILES]: {
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
    [POST_MODEL_FIELDS.LINK]: {
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
    [POST_MODEL_FIELDS.REPOST]: {
        type: mongoose.Schema.Types.ObjectId,
        ref: POST_MODEL_NAME,
        validate: [(value) => isValidRef(POST_MODEL_NAME, value), VALIDATION_MESSAGES.POST_NOT_EXIST]
    },
    [POST_MODEL_FIELDS.REPLY_TO]: {
        type: mongoose.Schema.Types.ObjectId,
        ref: POST_MODEL_NAME,
        validate: [(value) => isValidRef(POST_MODEL_NAME, value), VALIDATION_MESSAGES.POST_NOT_EXIST]
    },
    [POST_MODEL_FIELDS.MENTIONS]: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: USER_MODEL_NAME }],
        default: undefined,
        validate: [(value) => areValidRefs(USER_MODEL_NAME, value), VALIDATION_MESSAGES.USER_NOT_EXIST]
    },
    [POST_MODEL_FIELDS.TAGS]: {
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