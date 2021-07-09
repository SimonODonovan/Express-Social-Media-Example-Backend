import RESPONSE_CODES from "../constants/responseCodes.js";
import mongoose from "mongoose";
import { HAS_NO_MATCHING_DOCUMENTS_CONSTANTS } from "../constants/middlewareConstants.js";

/**
 * Ensure a given model does not have any matching documents for given filter.
 * @param {Object} req       - Express request object.
 * @param {Object} res       - Express response object.
 * @param {Function} next    - Express next middleware function.
 * @param {String} modelName - Mongoose model to search.
 * @param {Object} filter    - Mongoose find operation filter.
 * @returns {Object}         - Express response object.
 */
const hasNoMatchingDocuments = async (req, res, next, modelName, filter) => {
    const conn = mongoose.connection;
    const badQueryResponse = RESPONSE_CODES.CLIENT_ERROR.BAD_REQUEST;

    const existingModels = conn.modelNames();
    if (existingModels.includes(modelName)) {
        const model = conn.model(modelName);
        const documents = await model.find(filter);

        if(documents.length > 0) 
            return res.status(badQueryResponse.code).json({
                ...badQueryResponse,
                message: HAS_NO_MATCHING_DOCUMENTS_CONSTANTS.HAS_MATCHING_DOCUMENT(modelName, filter)
            });
    }

    return next();
};

export default hasNoMatchingDocuments;