import { Strategy as LocalStrategy } from 'passport-local';
import User from '../../models/userModel.js';
import bcrypt from "bcrypt";
import RESPONSE_CODES from '../../constants/responseCodes.js';

// Serialize & Deserialize used with passport sessions.
const serializeUser = (user, done) => {
    console.log("serializeUser");
    done(null, user.id);
}
const deserializeUser = (id, done) => {
    console.log("deserializeUser");
    User.findById(id, (err, user) => {
        done(err, user);
    });
}

/**
 * Passport authentication local strategy.
 * Attempts to authenticated a user using email/password and passes results to next middleware.
 * See /controllers/authController.js for login functionality which leverages this strategy.
 * usernameField & passwordField define expected parameters in request body with logging in.
 * Passports serializeUser/deserializeUser get user details on requests that do not provide these parameters.
 */
const localStrategy = new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try {
            const foundUser = await User.findOne({ email: email }).exec();
            if (!foundUser) {
                return done(null, false, { ...RESPONSE_CODES.CLIENT_ERROR.NOT_FOUND, message: "User not found." });
            }
            const isValidPassword = await bcrypt.compare(password, foundUser.password);
            if (!isValidPassword) {
                return done(null, false, { ...RESPONSE_CODES.CLIENT_ERROR.BAD_REQUEST, message: "Incorrect login information." });
            }
            return done(null, foundUser, RESPONSE_CODES.SUCCESS.OK);
        } catch (err) {
            return done(err, false, RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR);
        }
    }
);

export { localStrategy, serializeUser, deserializeUser };