import { beforeAll, afterAll, afterEach, describe, test, expect, jest } from "@jest/globals";
import app from "../../server/server.js";
import { startServer, stopServer } from "../../server/server.js";
import { API_ROUTES } from "../../../../../constants/apiRoutes.js";
import usersRouter, { ROUTES } from "../../../../../routes/usersRouter.js";
import User from "../../../../../models/userModel.js";
import request from "supertest";
import RESPONSE_CODES from "../../../../../constants/responseCodes.js";
import { localStrategy } from "../../../../../lib/passportStrategies/passportStrategies.js";
import passport from "passport";
import * as authController from "../../../../../controllers/authController.js";
import { EMAILS, HANDLES, PASSWORDS, USERNAMES } from "../../../testConstants/userConstants.js";
import bcrypt from "bcrypt";
import { ERROR_MESSAGES, USER_MODEL_FIELDS } from "../../../../../constants/userConstants.js";

beforeAll(() => setup());
afterEach(() => jest.restoreAllMocks());
afterAll(() => teardown());
let loginRoute;
let signupRoute;

/**
 * Setup test environment before any tests run.
 */
const setup = async () => {
    app.use(API_ROUTES.USERS, usersRouter);
    loginRoute = API_ROUTES.USERS + ROUTES.LOGIN;
    signupRoute = API_ROUTES.USERS + ROUTES.SIGNUP;
    startServer();
};

/**
 * Clean test environment after all tests have executed.
 */
const teardown = async () => {
    stopServer();
};

describe("Auth Controller", () => {

    describe("login", () => {
        test("Calls Local authentication strategy", () => {
            // Mock
            const localStrategySpy = jest.spyOn(localStrategy, "authenticate").mockImplementation();
            const passportAuthSpy = jest.spyOn(passport, "authenticate");

            // Test
            authController.login({}, {}, () => { });
            expect(localStrategySpy).toHaveBeenCalledTimes(1);
            expect(localStrategySpy).toHaveBeenCalledWith({}, {});
            expect(passportAuthSpy).toHaveBeenCalledTimes(1);
            expect(passportAuthSpy).toHaveBeenCalledWith("local", expect.any(Function));
        });

        test("Returns 200 after user authenticated successfully", (done) => {
            // Var
            const testUser = { [USER_MODEL_FIELDS.USERNAME]: USERNAMES.VALID_USERNAME_ALPHANUM };
            const req = {
                [USER_MODEL_FIELDS.EMAIL]: EMAILS.VALID_EMAIL,
                [USER_MODEL_FIELDS.PASSWORD]: PASSWORDS.VALID_PASSWORD,
            };
            const expectedRes = RESPONSE_CODES.SUCCESS.OK;

            // Mock
            User.findOne = jest.fn().mockReturnValue(testUser);
            bcrypt.compare = jest.fn().mockReturnValue(true);

            // Test
            request(app)
                .post(loginRoute)
                .send(req)
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        expect(res.status).toEqual(expectedRes.code);
                        expect(res.body).toEqual(expectedRes);
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });

        test("Returns 404 if no user found and no error occurred", (done) => {
            // Var
            const req = {
                [USER_MODEL_FIELDS.EMAIL]: EMAILS.VALID_EMAIL,
                [USER_MODEL_FIELDS.PASSWORD]: PASSWORDS.VALID_PASSWORD
            };
            const expectedRes = {
                ...RESPONSE_CODES.CLIENT_ERROR.NOT_FOUND,
                message: ERROR_MESSAGES.USER_NOT_FOUND
            };

            // Mock
            User.findOne = jest.fn().mockReturnValue(false);

            // Test
            request(app)
                .post(loginRoute)
                .send(req)
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        expect(res.status).toEqual(expectedRes.code);
                        expect(res.body).toEqual(expectedRes);
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });

        test("Returns 500 and error on authentication exception", (done) => {
            // Var
            const errorMessage = "Error message";
            const req = {
                [USER_MODEL_FIELDS.EMAIL]: EMAILS.VALID_EMAIL,
                [USER_MODEL_FIELDS.PASSWORD]: PASSWORDS.VALID_PASSWORD
            };
            const expectedRes = RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR;

            // Mock
            User.findOne = jest.fn().mockRejectedValue(new Error(errorMessage));

            // Test
            request(app)
                .post(loginRoute)
                .send(req)
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        expect(res.status).toEqual(expectedRes.code);
                        expect(res.body).toEqual(expectedRes);
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });
    });

    describe("signup", () => {
        test("Returns 201 create success on successful signup", (done) => {
            // Var
            const testUser = { [USER_MODEL_FIELDS.USERNAME]: USERNAMES.VALID_USERNAME_ALPHANUM };
            const expectedRes = { ...RESPONSE_CODES.SUCCESS.CREATED, message: "Created user successfully." };
            const req = {
                [USER_MODEL_FIELDS.EMAIL]: EMAILS.VALID_EMAIL,
                [USER_MODEL_FIELDS.PASSWORD]: PASSWORDS.VALID_PASSWORD,
                [USER_MODEL_FIELDS.USERNAME]: USERNAMES.VALID_USERNAME_ALPHANUM,
                [USER_MODEL_FIELDS.HANDLE]: HANDLES.VALID_HANDLE
            };

            // Mock
            const userCreateSpy = jest.spyOn(User, "create").mockImplementation().mockReturnValue(testUser);
            const bcryptHashSpy = jest.spyOn(bcrypt, "hash").mockReturnValue(PASSWORDS.VALID_PASSWORD);

            // Test
            request(app)
                .post(signupRoute)
                .send(req)
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        expect(res.status).toEqual(expectedRes.code);
                        expect(res.body).toEqual(expectedRes);
                        expect(bcryptHashSpy).toHaveBeenCalledTimes(1);
                        expect(bcryptHashSpy).toHaveBeenCalledWith(PASSWORDS.VALID_PASSWORD, 12);
                        expect(userCreateSpy).toHaveBeenCalledTimes(1);
                        expect(userCreateSpy).toHaveBeenCalledWith(req);
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });

        test("Returns 500 on exception", (done) => {
            // Var
            const errorMessage = "Error message";
            const expectedRes = { ...RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR, message: errorMessage };
            const req = { [USER_MODEL_FIELDS.PASSWORD]: PASSWORDS.VALID_PASSWORD };

            // Mock
            const bcryptHashSpy = jest.spyOn(bcrypt, "hash").mockRejectedValue(new Error(errorMessage));

            // Test
            request(app)
                .post(signupRoute)
                .send(req)
                .end((err, res) => {
                    try {
                        if (err) throw err;
                        expect(res.status).toEqual(expectedRes.code);
                        expect(res.body).toEqual(expectedRes);
                        expect(bcryptHashSpy).toHaveBeenCalledTimes(1);
                        expect(bcryptHashSpy).toHaveBeenCalledWith(PASSWORDS.VALID_PASSWORD, 12);
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });

        test("Performs at least 12 salt rounds on password", (done) => {
            // Var
            const testUser = { [USER_MODEL_FIELDS.USERNAME]: USERNAMES.VALID_USERNAME_ALPHANUM };
            const req = {
                [USER_MODEL_FIELDS.EMAIL]: EMAILS.VALID_EMAIL,
                [USER_MODEL_FIELDS.PASSWORD]: PASSWORDS.VALID_PASSWORD,
                [USER_MODEL_FIELDS.USERNAME]: USERNAMES.VALID_USERNAME_ALPHANUM,
                [USER_MODEL_FIELDS.HANDLE]: HANDLES.VALID_HANDLE
            };

            // Mock
            jest.spyOn(User, "create").mockImplementation().mockReturnValue(testUser);
            const bcryptHashSpy = jest.spyOn(bcrypt, "hash").mockReturnValue(PASSWORDS.VALID_PASSWORD);

            // Test
            request(app)
                .post(signupRoute)
                .send(req)
                .end((err) => {
                    try {
                        if (err) throw err;
                        expect(bcryptHashSpy.mock.calls[0][1]).toBeGreaterThanOrEqual(12);
                        done();
                    } catch (e) {
                        done(e);
                    }
                });
        });
    });
});