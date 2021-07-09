import RESPONSE_CODES from "../constants/responseCodes.js";
import { HAS_BODY_PARAMS_ALL_CONSTANTS } from "../constants/middlewareConstants.js";

/**
 * Check the req Object's body for presence of all supplied keys.
 * @param {Object} req      - Express request object.
 * @param {Object} res      - Express response object.
 * @param {Function} next   - Express next middleware function.
 * @param {[String]} params - Params to check for in req Object's body.
 * @returns {Object}        - Express response object.
 */
const hasBodyParamsAll = (req, res, next, params) => {
    const badRequestParams = RESPONSE_CODES.CLIENT_ERROR.BAD_REQUEST;
    if (!req.body)
        return res.status(badRequestParams.code).json({
            ...badRequestParams,
            message: HAS_BODY_PARAMS_ALL_CONSTANTS.NO_BODY
        });

    const missingParams = [];
    for (const param of params) {
        const hasParam = Boolean(req.body[param]);
        if (!hasParam)
            missingParams.push(param);
    }

    if (missingParams.length > 0)
        return res.status(badRequestParams.code).json({
            ...badRequestParams,
            message: HAS_BODY_PARAMS_ALL_CONSTANTS.MISSING_PARAMS(missingParams)
        });

    return next();
};

export default hasBodyParamsAll;