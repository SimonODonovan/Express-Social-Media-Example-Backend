import User from "../userModel.js";

/**
 * Mongoose validator, check if User email is already in use.
 * @param {String} value    - Email String to validate.
 * @returns {Promise}       - Email is not in use.
 */
const emailInUse = async (value) => {
    const foundUser = await User.findOne({ email: value });
    return Boolean(!foundUser);
};

/**
 * Mongoose validator, check if User handle is already in use.
 * @param {String} value    - Handle String to validate.
 * @returns {Promise}       - Handle is not in use.
 */
const handleInUse = async (value) => {
    const foundUser = await User.findOne({ handle: value });
    return Boolean(!foundUser);
};

/**
 * Mongoose validator, check if User handle contains whitespace.
 * @param {String} value    - Handle String to validate.
 * @returns {Promise}       - Handle does not have whitespace.
 */
const validateHandleWhitespace = (value) => {
    const noWhitespace = value.indexOf(" ") === -1;
    return noWhitespace;
};

export { emailInUse, handleInUse, validateHandleWhitespace };