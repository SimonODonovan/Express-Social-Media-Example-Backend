import User from '../models/userModel.js';
import bcrypt from "bcrypt";
import RESPONSE_CODES from '../constants/responseCodes.js';
import passport from 'passport';

/**
 * Attempt to create new session for given user.
 * Use only on signup & passport.authenticate custom callbacks. 
 * @param {Object} req      - Express request object.
 * @param {Object} user     - Mongo User document.
 * @param {Function} next   - Express next middleware function.
 */
const initSession = (req, user, next) => {
    req.logIn(user, err => {
        if (err) return next(err)
    })
}

/**
 * Create a new user.
 * Required User schema fields should be present in req.body.
 * See /models/userModel.js for User schema.
 * @param {Object} req      - Express request object.
 * @param {Object} res      - Express response object.
 * @param {Function} next   - Express next middleware function.
 * @returns {Object}        - Express response object.
 */
const signup = async (req, res, next) => {
    const { email, password, username, handle } = req.body;
    try {
        const hashpassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            email: email,
            password: hashpassword,
            username: username,
            handle: handle
        });
        initSession(req, newUser, next);
        const createdResponse = RESPONSE_CODES.SUCCESS.CREATED;
        return res.status(createdResponse.code).json({
            ...createdResponse,
            message: "Created user successfully."
        });
    } catch (e) {
        res.status(400).json({
            ...RESPONSE_CODES.CLIENT_ERROR.BAD_REQUEST,
            message: e.message
        });
    }
}

/**
 * Log a user in.
 * See strategy definition for required fields which should be present in req.body.
 * local-passport strategy used is defined lib/passporStrategies/passportStrategies.
 * @param {Object} req      - Express request object.
 * @param {Object} res      - Express response object.
 * @param {Function} next   - Express next middleware function.
 * @returns {Object}        - Express response object.
 */
const login = async (req, res, next) => {
    passport.authenticate(
        'local',
        (err, user, info) => {
            if (err) {
                return res.status(info.code).json(info);
            }
            if (user) {
                initSession(req, user, next);
            }
            return res.status(info.code).json(info);
        }
    )(req, res, next);
}

export { signup, login }