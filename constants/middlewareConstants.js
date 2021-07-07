const hasParamsConstants = {
    noParams: "No request params available when expected.",
    missingParams: (missingParams) => `Missing expected req params ${missingParams.join(", ")}.`
};

const isValidObjectIdConstants = {
    invalidObjectId: "Invalid object ID provided."
};

const objectIdExistsConstants = {
    modelDoesNotExist: (modelName) => `No documents exist of type ${modelName}.`,
    idDoesNotExistInModel: (objectId, modelName) => `No documents with id ${objectId} in model ${modelName}.`
};

export { hasParamsConstants, isValidObjectIdConstants, objectIdExistsConstants };