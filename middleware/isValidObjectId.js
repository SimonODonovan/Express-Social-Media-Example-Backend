import RESPONSE_CODES from "../constants/responseCodes.js";
import mongoose from "mongoose";
import { IS_VALID_OBJECT_ID_CONSTANTS } from "../constants/middlewareConstants.js";

/**
 * Verify that a given value is a valid mongoose Object Id.
 * @param {Object} res      - Express response object.
 * @param {Function} next   - Express next middleware function.
 * @param {String} value    - The value to test.
 * @returns {Object}        - Express response object.
 */
const isValidObjectId = (_, res, next, value) => {
    const isValidPostId = mongoose.isValidObjectId(value);

    const badQueryResponse = RESPONSE_CODES.CLIENT_ERROR.BAD_REQUEST;
    if(!isValidPostId)
        return res.status(badQueryResponse.code).json({ 
            ...badQueryResponse, 
            message: IS_VALID_OBJECT_ID_CONSTANTS.INVALID_OBJECT_ID 
        });

    return next();
};

export default isValidObjectId;