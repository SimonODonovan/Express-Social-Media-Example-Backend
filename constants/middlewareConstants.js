// Declaration Conventions:
//     - All declarations should use const.
//     - Exported objects should be categorized by associated middleware.
//     - Use ES6 format "export const {name} = {value};".
//     - Names should be uppercase with underscore separators e.g. "VAR_NAME".

export const HAS_ROUTE_PARAMS_ALL_CONSTANTS = {
    NO_PARAMS: "No request params available when expected.",
    MISSING_PARAMS: (missingParams) => `Missing expected req route params ${missingParams.join(", ")}.`
};

export const HAS_BODY_PARAMS_ALL_CONSTANTS = {
    NO_BODY: "No request body available when expected.",
    MISSING_PARAMS: (missingParams) => `Missing expected req body params ${missingParams.join(", ")}.`
};

export const HAS_BODY_PARAMS_SOME_CONSTANTS = {
    NO_BODY: "No request body available when expected.",
    MISSING_PARAMS: (missingParams) => `Missing params, expected at least one of the following req body params ${missingParams.join(", ")}.`
};

export const HAS_NO_MATCHING_DOCUMENTS_CONSTANTS = {
    HAS_MATCHING_DOCUMENT: (modelName, filter) => `A document exists in model ${modelName} with values ${filter} when none were expected.`
};

export const IS_VALID_OBJECT_ID_CONSTANTS = {
    INVALID_OBJECT_ID: "Invalid object ID provided."
};

export const OBJECT_ID_EXISTS_CONSTANTS = {
    MODEL_DOES_NOT_EXIST: (modelName) => `No documents exists of type ${modelName}.`,
    ID_DOES_NOT_EXIST_IN_MODEL: (objectId, modelName) => `No documents with id ${objectId} in model ${modelName}.`
};
