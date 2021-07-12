// Declaration Conventions:
//     - All declarations should use const.
//     - Create Objects for constants with similar categories with plural name. e.g. "export const EMAILS = {};"
//     - Use ES6 format "export const {name} = {value};".
//     - Names should be uppercase with underscore separators e.g. "VAR_NAME".
//     - String values shold use camel case e.g. "varValue".

export const USER_MODEL_NAME = "user";
export const USER_ID = "userId";

export const USER_MODEL_FIELDS = {
    EMAIL: "email",
    PASSWORD: "password",
    USERNAME: "username",
    HANDLE: "handle",
    BIO: "bio",
    LOCATION: "location",
    AVATAR: "avatar"
};

export const SUCCESS_MESSAGES = {
    CREATED_USER: "Created user successfully."
};

export const ERROR_MESSAGES = {
    USER_NOT_FOUND: "User not found.",
    USER_INCORRECT_INFO: "Incorrect login information."
};

export const VALIDATION_MESSAGES = {
    EMAIL_REQUIRED: "Email is required.",
    EMAIL_INVALID: "Invalid email format.",
    EMAIL_INUSE: "Email already in use.",
    PASSWORD_REQUIRED: "Password is required.",
    USERNAME_REQUIRED: "Username is required.",
    USERNAME_TOO_SHORT: "Username too short.",
    USERNAME_TOO_LONG: "Username too long.",
    HANDLE_REQUIRED: "Handle is required.",
    HANDLE_INVALID: "Invalid handle format.",
    HANDLE_INVALID_WHITESPACE: "Invalid handle, has whitespace.",
    HANDLE_TOO_SHORT: "Handle too short.",
    HANDLE_TOO_LONG: "Handle too long.",
    HANDLE_INUSE: "Handle already in use.",
};