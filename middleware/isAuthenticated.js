import RESPONSE_CODES from "../constants/responseCodes.js";

/**
 * This middleware leverages passports req.isAuthenticated function
 * to test if a user session is established. If a session is found
 * it calls the next middlware. Otherwise an unathorized response is sent.
 * @param {Object} req      - Express request object.
 * @param {Object} res      - Express response object.
 * @param {Function} next   - Express next middleware function.
 * @returns {Object}        - Express response object.
 */
const isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated())
        return next();
    const unauthorizedResponse = RESPONSE_CODES.CLIENT_ERROR.UNAUTHORIZED;
    return res.status(unauthorizedResponse.code).json(unauthorizedResponse);
};

export default isAuthenticated;