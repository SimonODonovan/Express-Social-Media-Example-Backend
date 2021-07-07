// Declaration Conventions:
//     - Add new responses to the RESPONSE_CODES const.
//     - Outer keys should be uppercase with underscore separators e.g. "BAD_REQUEST".
//     - Bottom level keys should be lower case e.g. "code", "status", "message".
//     - String values shold use camel case e.g. "varValue".
//         - Except "message" values which should be standard human readable.

const _successStatus = "success";  // do not export
const _clientErrorStatus = "client error";  // do not export
const _serverErrorStatus = "server error";  // do not export
const RESPONSE_CODES = {
    SUCCESS: {
        OK: {
            code: 200,
            status: _successStatus,
            message: "Success."
        },
        CREATED: {
            code: 201,
            status: _successStatus,
            message: "Create successful."
        },
        NO_CONTENT: {
            code: 204,
            status: _successStatus,
            message: "Success, no content."
        }
    },

    CLIENT_ERROR: {
        BAD_REQUEST: {
            code: 400,
            status: _clientErrorStatus,
            message: "Invalid request content."
        },
        UNAUTHORIZED: {
            code: 401,
            status: _clientErrorStatus,
            message: "Unauthorized to perform this action."
        },
        FORBIDDEN: {
            code: 403,
            status: _clientErrorStatus,
            message: "Unable to perform this action."
        },
        NOT_FOUND: {
            code: 404,
            status: _clientErrorStatus,
            message: "Resource not found."
        },
    },

    SERVER_ERROR: {
        INTERNAL_ERROR: {
            code: 500,
            status: _serverErrorStatus,
            message: "Internal server error."
        },
        UNAVAILABLE: {
            code: 503,
            status: _serverErrorStatus,
            message: "Server is unavailable."
        }
    }
};

export default RESPONSE_CODES;