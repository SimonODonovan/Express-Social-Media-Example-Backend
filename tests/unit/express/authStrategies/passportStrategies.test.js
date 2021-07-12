import { beforeAll, afterAll, afterEach, describe, test, expect, jest } from "@jest/globals";
import { startServer, stopServer } from "../server/server.js";
import passport from "passport";
import User from "../../../../models/userModel.js";
import RESPONSE_CODES from "../../../../constants/responseCodes.js";
import { ERROR_MESSAGES, USER_MODEL_FIELDS } from "../../../../constants/userConstants.js";
import bcrypt from "bcrypt";
import { USERNAMES } from "../../testConstants/userConstants.js";
import { serializeUser, deserializeUser } from "../../../../lib/passportStrategies/passportStrategies.js";
import mongoose from "mongoose";

beforeAll(() => setup());
afterEach(() => jest.restoreAllMocks());
afterAll(() => teardown());

/**
 * Setup test environment before any tests run.
 */
const setup = async () => {
    startServer();
};

/**
 * Clean test environment after all tests have executed.
 */
const teardown = async () => {
    stopServer();
};

describe("Local Strategy", () => {
    test("Returns 404 if user not found", (done) => {
        User.findOne = jest.fn().mockResolvedValue(false);
        const authenticateCallback = jest.fn((err, user, info) => {
            try {
                expect(err).toBeNull();
                expect(user).toBeFalsy();
                expect(info).toEqual({ ...RESPONSE_CODES.CLIENT_ERROR.NOT_FOUND, message: ERROR_MESSAGES.USER_NOT_FOUND });
                expect(authenticateCallback).toHaveBeenCalledTimes(1);
                done();
            } catch (err) {
                done(err);
            }
        });
        const req = { body: { email: "email@address.com", password: "password" } };
        const res = {};
        passport.authenticate("local", authenticateCallback)(req, res, jest.fn());
    });

    test("Returns 400 if user password incorrect", (done) => {
        User.findOne = jest.fn().mockResolvedValue(true);
        bcrypt.compare = jest.fn().mockResolvedValue(false);
        const authenticateCallback = jest.fn((err, user, info) => {
            try {
                expect(err).toBeNull();
                expect(user).toBeFalsy();
                expect(info).toEqual({ ...RESPONSE_CODES.CLIENT_ERROR.BAD_REQUEST, message: ERROR_MESSAGES.USER_INCORRECT_INFO });
                expect(authenticateCallback).toHaveBeenCalledTimes(1);
                done();
            } catch (err) {
                done(err);
            }
        });
        const req = { body: { email: "email@address.com", password: "password" } };
        const res = {};
        passport.authenticate("local", authenticateCallback)(req, res, jest.fn());
    });

    test("Returns 200 and user model if correct username and password", (done) => {
        const testUser = { [USER_MODEL_FIELDS.USERNAME]: USERNAMES.VALID_USERNAME_ALPHANUM };
        User.findOne = jest.fn().mockResolvedValue(testUser);
        bcrypt.compare = jest.fn().mockResolvedValue(true);
        const authenticateCallback = jest.fn((err, user, info) => {
            try {
                expect(err).toBeNull();
                expect(user).toEqual(testUser);
                expect(info).toEqual(RESPONSE_CODES.SUCCESS.OK);
                expect(authenticateCallback).toHaveBeenCalledTimes(1);
                done();
            } catch (err) {
                done(err);
            }
        });
        const req = { body: { email: "email@address.com", password: "password" } };
        const res = {};
        passport.authenticate("local", authenticateCallback)(req, res, jest.fn());
    });

    test("Returns 500 and no info on exception", (done) => {
        const errorMessage = "Error message";
        User.findOne = jest.fn().mockRejectedValue(new Error(errorMessage));
        const authenticateCallback = jest.fn((err, user, info) => {
            try {
                expect(err).not.toBeNull();
                expect(err.message).toBe(errorMessage);
                expect(user).toBeUndefined();
                expect(info).toBeUndefined();
                expect(authenticateCallback).toHaveBeenCalledTimes(1);
                done();
            } catch (err) {
                done(err);
            }
        });
        const req = { body: { [USER_MODEL_FIELDS.EMAIL]: "email@address.com", [USER_MODEL_FIELDS.PASSWORD]: "password" } };
        const res = {};
        passport.authenticate("local", authenticateCallback)(req, res, jest.fn());
    });
});

describe("Serialize User", () => {
    test("User is serialized by user id", () => {
        // Var
        const objectId = mongoose.Types.ObjectId();
        const user = {id: objectId};
        const serializeCallback = jest.fn();

        // Test
        serializeUser(user, serializeCallback);
        expect(serializeCallback).toHaveBeenCalledTimes(1);
        expect(serializeCallback).toHaveBeenCalledWith(null, user.id);
    });
});

describe("Deserialize User", () => {
    test("User is deserialized by user id", async () => {
        // Var
        const objectId = mongoose.Types.ObjectId();
        const user = {id: objectId};
        const deserializeCallback = jest.fn();

        // Mock
        const userFindSpy = jest.spyOn(User, "findById").mockResolvedValue(user);

        // Test
        await deserializeUser(user.id, deserializeCallback);
        expect(deserializeCallback).toHaveBeenCalledTimes(1);
        expect(deserializeCallback).toHaveBeenCalledWith(null, user);
        expect(userFindSpy).toHaveBeenCalledTimes(1);
        expect(userFindSpy).toHaveBeenCalledWith(user.id);
    });

    test("Exceptions are passed to done callback", async () => {
        // Var
        const error = new Error("Error message");
        const objectId = mongoose.Types.ObjectId();
        const user = {id: objectId};
        const deserializeCallback = jest.fn();

        // Mock
        jest.spyOn(User, "findById").mockRejectedValue(error);

        // Test
        await deserializeUser(user.id, deserializeCallback);
        expect(deserializeCallback).toHaveBeenCalledTimes(1);
        expect(deserializeCallback).toHaveBeenCalledWith(error);
    });
});