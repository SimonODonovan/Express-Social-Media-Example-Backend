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
        return res.status(successResponse.code).json({ ...successResponse, data: user });
    } catch (err) {
        const errorResponse = RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR;
        return res.status(errorResponse.code).json({
            ...errorResponse,
            message: err.message
        });
    }
};

export { checkEmail };