// Declaration Conventions:
//     - All declarations should use const.
//     - Create Objects for constants with similar categories with plural name. e.g. "export const EMAILS = {};"
//     - Use ES6 format "export const {name} = {value};".
//     - Names should be uppercase with underscore separators e.g. "VAR_NAME".
//     - String values shold use camel case e.g. "varValue".

export const POST_MODEL_NAME = "post";
export const POST_ID = "postId";
export const POST_TIMESTAMP_REGEX = /^\w{3},\s\d{2}\s\w{3}\s\d{4}\s(\d{2}(:|\s)){3}GMT$/;
export const POST_TAG_REGEX = /^#\w{1,24}$/;

export const SUCCESS_MESSAGES = {
    CREATED_POST: "New Post created."
};

export const VALIDATION_MESSAGES = {
    USER_REQUIRED: "User is required.",
    USER_NOT_EXIST: "User does not exist.",
    POST_NOT_EXIST: "Post does not exist.",
    NO_POST_CONTENT: "No post content.",
    TIMESTAMP_REQUIRED: "Timestamp is required.",
    TIMESTAMP_INVALID_FORMAT: "Invalid timestamp format.",
    TIMESTAMP_INVALID_CONTENT: "Invalid timestamp content.",
    MESSAGE_TOO_SHORT: "Message too short.",
    MESSAGE_TOO_LONG: "Message too long.",
    FILES_INVALID_CONTENT: "Invalid files content.",
    LINK_INVALID_CONTENT: "Invalid link content.",
    TAG_INVALID_FORMAT: "Invalid tag format.",
    TAG_TOO_SHORT: "Tag too short.",
    TAG_TOO_LONG: "Tag too long.",
};