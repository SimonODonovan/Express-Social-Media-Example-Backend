// Declaration Conventions:
//     - All declarations should use const.
//     - Create Objects for constants with similar categories with plural name. e.g. "export const EMAILS = {};"
//     - Use ES6 format e.g. "export const {name} = {value};" for singular constants.
//     - Names should be uppercase with underscore separators e.g. "VAR_NAME".

export const TIMESTAMPS = {
    VALID_TIMESTAMP: "Wed, 23 Jun 2021 14:22:08 GMT",
    INVALID_TIMESTAMP_IS_NUMBER: 1234,
    INVALID_TIMESTAMP_FORMAT: "incorrect timestamp string",
    INVALID_TIMESTAMP_CONTENT: "Wed, 23 Jun 2021 94:22:08 GMT"
};

export const MESSAGES = {
    VALID_MESSAGE: "This is a valid Post message.",
    INVALID_MESSAGE_EMPTY: "",
    INVALID_MESSAGE_TOO_LONG: "a".repeat(300)
};

export const FILES = {
    VALID_FILES: ["https://storage.com/folder/filename.jpg"],
    INVALID_FILES_NOT_STRINGS: [1234, 4567],
    INVALID_FILES_NOT_URL: ["htt:/storage.com"]
};

export const LINKS = {
    VALID_LINK: "https://storage.com/folder/filename.jpg",
    INVALID_LINK_IS_NUMBER: 1234,
    INVALID_LINK_NO_TOP_DOMAIN: "https://website/folder/subfolder",
};

export const TAGS = {
    VALID_TAGS: ["#1234", "#Tag"],
    INVALID_TAGS_IS_NUMBER: [1234],
    INVALID_TAGS_FORMAT: ["ID"]
};