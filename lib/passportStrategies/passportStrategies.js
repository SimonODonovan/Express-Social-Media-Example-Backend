import { Strategy as LocalStrategy } from "passport-local";
import User from "../../models/userModel.js";
import bcrypt from "bcrypt";
import RESPONSE_CODES from "../../constants/responseCodes.js";
import { ERROR_MESSAGES, USER_MODEL_FIELDS } from "../../constants/userConstants.js";

// Serialize & Deserialize used with passport sessions.
const serializeUser = (user, done) => {
    done(null, user.id);
};
const deserializeUser = async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
};

/**
 * Passport authentication local strategy.
 * Attempts to authenticated a user using email/password and passes results to next middleware.
 * See /controllers/authController.js for login functionality which leverages this strategy.
 * usernameField & passwordField define expected parameters in request body with logging in.
 * Passports serializeUser/deserializeUser get user details on requests that do not provide these parameters.
 */
const localStrategy = new LocalStrategy(
    {
        usernameField: USER_MODEL_FIELDS.EMAIL,
        passwordField: USER_MODEL_FIELDS.PASSWORD
    },
    async (email, password, done) => {
        try {
            const foundUser = await User.findOne({ [USER_MODEL_FIELDS.EMAIL]: email });
            if (!foundUser) {
                return done(null, false, { ...RESPONSE_CODES.CLIENT_ERROR.NOT_FOUND, message: ERROR_MESSAGES.USER_NOT_FOUND });
            }
            const isValidPassword = await bcrypt.compare(password, foundUser[USER_MODEL_FIELDS.PASSWORD]);
            if (!isValidPassword) {
                return done(null, false, { ...RESPONSE_CODES.CLIENT_ERROR.BAD_REQUEST, message: ERROR_MESSAGES.USER_INCORRECT_INFO });
            }
            return done(null, foundUser, RESPONSE_CODES.SUCCESS.OK);
        } catch (err) {
            return done(err);
        }
    }
);

export { localStrategy, serializeUser, deserializeUser };