// Declaration Conventions:
//     - Add new responses to the RESPONSE_CODES const.
//     - Outer keys should be uppercase with underscore separators e.g. "BAD_REQUEST".
//     - Bottom level keys should be lower case e.g. "code", "status", "message".
//     - String values shold use camel case e.g. "varValue".
//         - Except "message" values which should be standard human readable.

const RESPONSE_CODES = {
    SUCCESS: {
        OK: {
            code: 200,
            status: "success",
            message: "Success."
        },
        CREATED: {
            code: 201,
            status: "success",
            message: "Create successful."
        },
        NO_CONTENT: {
            code: 204,
            status: "success",
            message: "Success, no content."
        }
    },

    CLIENT_ERROR: {
        BAD_REQUEST: {
            code: 400,
            status: "error",
            message: "Invalid request content."
        },
        UNAUTHORIZED: {
            code: 401,
            status: "error",
            message: "Unauthorized to perform this action."
        },
        FORBIDDEN: {
            code: 403,
            status: "error",
            message: "Unable to perform this action."
        },
        NOT_FOUND: {
            code: 404,
            status: "error",
            message: "Resource not found."
        },
    },

    SERVER_ERROR: {
        INTERNAL_ERROR: {
            code: 500,
            status: "error",
            message: "Internal server error."
        },
        UNAVAILABLE: {
            code: 503,
            status: "error",
            message: "Server is unavailable."
        }
    }
}

export default RESPONSE_CODES;