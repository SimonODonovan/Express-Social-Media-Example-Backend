import RESPONSE_CODES from "../constants/responseCodes.js";
import { HAS_ROUTE_PARAMS_ALL_CONSTANTS } from "../constants/middlewareConstants.js";

/**
 * Check the req Object's param for presence of all supplied keys.
 * @param {Object} req      - Express request object.
 * @param {Object} res      - Express response object.
 * @param {Function} next   - Express next middleware function.
 * @param {[String]} params - Params to check for in req Object.
 * @returns {Object}        - Express response object.
 */
const hasRouteParamsAll = (req, res, next, params) => {
    const badRequestParams = RESPONSE_CODES.CLIENT_ERROR.BAD_REQUEST;
    if (!req.params)
        return res.status(badRequestParams.code).json({
            ...badRequestParams,
            message: HAS_ROUTE_PARAMS_ALL_CONSTANTS.NO_PARAMS
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
            message: HAS_ROUTE_PARAMS_ALL_CONSTANTS.MISSING_PARAMS(missingParams)
        });

    return next();
};

export default hasRouteParamsAll;