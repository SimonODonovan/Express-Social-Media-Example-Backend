// Declaration Conventions:
//     - All declarations should use const.
//     - Create Objects for constants with similar categories with plural name. e.g. "export const EMAILS = {};"
//     - Use ES6 format "export const {name} = {value};".
//     - Names should be uppercase with underscore separators e.g. "VAR_NAME".
//     - String values shold use camel case e.g. "varValue".

export const LIKE_MODEL_NAME = "like";
export const LIKE_ID = "likeId";

export const SUCCESS_MESSAGES = {
    CREATED_LIKE: "Post liked."
};

export const VALIDATION_MESSAGES = {
    USER_REQUIRED: "User is required.",
    USER_NOT_EXIST: "User does not exist.",
    POST_REQUIRED: "Post is required.",
    POST_NOT_EXIST: "Post does not exist."
};