import RESPONSE_CODES from "../constants/responseCodes.js";
import mongoose from "mongoose";
import { OBJECT_ID_EXISTS_CONSTANTS } from "../constants/middlewareConstants.js";

/**
 * Verify that a given Object Id is present in a given Model.
 * @param {Object} res          - Express response object.
 * @param {Function} next       - Express next middleware function.
 * @param {String} objectId     - The id to lookup.
 * @param {String} modelName    - The model to search.
 * @returns {Promise}           - Express response object.
 */
const objectIdExists = async (_, res, next, objectId, modelName) => {
    const conn = mongoose.connection;
    const badQueryResponse = RESPONSE_CODES.CLIENT_ERROR.BAD_REQUEST;

    const existingModels = conn.modelNames();
    if (!(existingModels.includes(modelName)))
        return res.status(badQueryResponse.code).json({
            ...badQueryResponse,
            message: OBJECT_ID_EXISTS_CONSTANTS.MODEL_DOES_NOT_EXIST(modelName)
        });

    const model = conn.model(modelName);
    const document = await model.findById(objectId);

    if (!document)
        return res.status(badQueryResponse.code).json({
            ...badQueryResponse,
            message: OBJECT_ID_EXISTS_CONSTANTS.ID_DOES_NOT_EXIST_IN_MODEL(objectId, modelName)
        });

    return next();
};

export default objectIdExists;