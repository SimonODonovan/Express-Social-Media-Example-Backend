import RESPONSE_CODES from "../constants/responseCodes.js";
import { HAS_BODY_PARAMS_SOME_CONSTANTS } from "../constants/middlewareConstants.js";

/**
 * Check the req Object's body for presence of at least one of the supplied keys.
 * @param {Object} req      - Express request object.
 * @param {Object} res      - Express response object.
 * @param {Function} next   - Express next middleware function.
 * @param {[String]} params - Params to check for in req Object's body.
 * @returns {Object}        - Express response object.
 */
const hasBodyParamsSome = (req, res, next, params) => {
    const badRequestParams = RESPONSE_CODES.CLIENT_ERROR.BAD_REQUEST;
    if (!req.body)
        return res.status(badRequestParams.code).json({
            ...badRequestParams,
            message: HAS_BODY_PARAMS_SOME_CONSTANTS.NO_BODY
        });

    let paramCount = 0;
    for (const param of params) {
        const hasParam = Boolean(req.body[param]);
        if (hasParam)
            paramCount++;
    }

    if (paramCount < 1)
        return res.status(badRequestParams.code).json({
            ...badRequestParams,
            message: HAS_BODY_PARAMS_SOME_CONSTANTS.MISSING_PARAMS(params)
        });

    return next();
};

export default hasBodyParamsSome;