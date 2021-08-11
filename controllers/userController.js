import RESPONSE_CODES from "../constants/responseCodes.js";
import { USER_MODEL_FIELDS } from "../constants/userConstants.js";
import User from "../models/userModel.js";

/**
 * Check if a supplied email is already in use by any User. 
 * @param {Object} req      - Express request object.
 * @param {Object} user     - Mongo User document.
 * @returns {Promise}       - Express response object.
 */
const checkEmail = async (req, res) => {
    try {
        const emailField = USER_MODEL_FIELDS.EMAIL;
        const successResponse = RESPONSE_CODES.SUCCESS.OK;
        const user = await User.findOne({ email: req.params[emailField] }, `${emailField} -_id`);
        return res.status(successResponse.code).json({ ...successResponse, email: user });
    } catch (err) {
        const errorResponse = RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR;
        return res.status(errorResponse.code).json({
            ...errorResponse,
            message: err.message
        });
    }
};

/**
 * Check if a supplied handle is already in use by any User. 
 * @param {Object} req      - Express request object.
 * @param {Object} user     - Mongo User document.
 * @returns {Promise}       - Express response object.
 */
const checkHandle = async (req, res) => {
    try {
        const handleField = USER_MODEL_FIELDS.HANDLE;
        const successResponse = RESPONSE_CODES.SUCCESS.OK;
        const user = await User.findOne({ handle: req.params[handleField] }, `${handleField} -_id`);
        return res.status(successResponse.code).json({ ...successResponse, handle: user });
    } catch (err) {
        const errorResponse = RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR;
        return res.status(errorResponse.code).json({
            ...errorResponse,
            message: err.message
        });
    }
};

/**
 * Endpoint for validating user is logged in.
 * Routes using this endpoint must call isAuthenticated middleware,
 * if this endpoint is reached we can assume user has been authenticated
 * by the express middleware and just need to return a valid response.
 * @param {Object} req      - Express request object 
 * @param {Object} res      - Express response object
 * @returns {Object}        - Express response object
 */
const isAuthenticated = (req, res) => {
    const successResponse = RESPONSE_CODES.SUCCESS.OK;
    return res.status(successResponse.code).json(successResponse);
};

export { checkEmail, checkHandle, isAuthenticated };