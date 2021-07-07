import RESPONSE_CODES from "../constants/responseCodes.js";
import { hasParamsConstants } from "../constants/middlewareConstants.js";

/**
 * Check the req Object for presence of all supplied params.
 * @param {Object} req      - Express request object.
 * @param {Object} res      - Express response object.
 * @param {Function} next   - Express next middleware function.
 * @param {[String]} params - Params to check for in req Object.
 * @returns {Object}        - Express response object.
 */
const hasParams = (req, res, next, params) => {
    const badRequestParams = RESPONSE_CODES.CLIENT_ERROR.BAD_REQUEST;
    if (!req.params)
        return res.status(badRequestParams.code).json({
            ...badRequestParams,
            message: hasParamsConstants.noParams
        });

    const missingParams = [];
    for (const param of params) {
        const hasParam = Boolean(req.params[param]);
        if (!hasParam)
            missingParams.push(param);
    }

    if (missingParams.length > 0)
        return res.status(badRequestParams.code).json({
            ...badRequestParams,
            message: hasParamsConstants.missingParams(missingParams)
        });

    return next();
};

export default hasParams;