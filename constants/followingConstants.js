import { USER_MODEL_NAME } from "./userConstants.js";

// Declaration Conventions:
//     - All declarations should use const.
//     - Create Objects for constants with similar categories with plural name. e.g. "export const EMAILS = {};"
//     - Use ES6 format "export const {name} = {value};".
//     - Names should be uppercase with underscore separators e.g. "VAR_NAME".
//     - String values shold use camel case e.g. "varValue".


export const FOLLOWING_MODEL_NAME = "following";
export const FOLLOWING_ID = "followingId";

export const FOLLOWING_MODEL_FIELDS = {
    FOLLOWER: `${USER_MODEL_NAME}Follower`,
    FOLLOWING: `${USER_MODEL_NAME}Following`
};

export const SUCCESS_MESSAGES = {
    CREATED_FOLLOWING: "New Following created."
};

export const VALIDATION_MESSAGES = {
    FOLLOWER_USER_REQUIRED: "Follower User is required.",
    FOLLOWING_USER_REQUIRED: "Following User is required.",
    FOLLOWER_USER_NOT_EXIST: "Follower User does not exist.",
    FOLLOWING_USER_NOT_EXIST: "Following User does not exist.",
};