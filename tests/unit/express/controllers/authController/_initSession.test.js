import { describe, test, expect, jest } from "@jest/globals";
import { mockResponse } from "../../../testConstants/generalConstants.js";
import { EMAILS, HANDLES, PASSWORDS, USERNAMES } from "../../../testConstants/userConstants.js";
import User from "../../../../../models/userModel.js";
import bcrypt from "bcrypt";
import * as authController from "../../../../../controllers/authController.js";
import { USER_MODEL_FIELDS } from "../../../../../constants/userConstants.js";

/**
 * These tests relate to AuthController but test the private
 * function _initSession. Since authController.test.js creates an
 * express server for testing it overwrites the Req object when calling
 * login or signup. This additional test file is used to bypass this
 * and mock the req object used for _initSession.
 */
describe("_initSession", () => {
    test("Does not call error callback if login succeeds", async () => {
        // Var
        const testUser = { [USER_MODEL_FIELDS.USERNAME]: USERNAMES.VALID_USERNAME_ALPHANUM };
        const req = {
            body: {
                [USER_MODEL_FIELDS.EMAIL]: EMAILS.VALID_EMAIL,
                [USER_MODEL_FIELDS.PASSWORD]: PASSWORDS.VALID_PASSWORD,
                [USER_MODEL_FIELDS.USERNAME]: USERNAMES.VALID_USERNAME_ALPHANUM,
                [USER_MODEL_FIELDS.HANDLE]: HANDLES.VALID_HANDLE,
            },
            logIn: (user, callback) => callback(undefined)
        };
        const res = mockResponse();

        // Mock
        jest.spyOn(User, "create").mockImplementation().mockReturnValue(testUser);
        jest.spyOn(bcrypt, "hash").mockReturnValue(PASSWORDS.VALID_PASSWORD);
        const nextFunc = jest.fn();

        // Test
        await authController.signup(req, res, nextFunc);
        expect(nextFunc).not.toBeCalled();
    });

    test("Passes error to next function on session create failure", async () => {
        // Var
        const testUser = { [USER_MODEL_FIELDS.USERNAME]: USERNAMES.VALID_USERNAME_ALPHANUM };
        const error = new Error("Error message");
        const req = {
            body: {
                [USER_MODEL_FIELDS.EMAIL]: EMAILS.VALID_EMAIL,
                [USER_MODEL_FIELDS.PASSWORD]: PASSWORDS.VALID_PASSWORD,
                [USER_MODEL_FIELDS.USERNAME]: USERNAMES.VALID_USERNAME_ALPHANUM,
                [USER_MODEL_FIELDS.HANDLE]: HANDLES.VALID_HANDLE,
            },
            logIn: (user, callback) => callback(error)
        };
        const res = mockResponse();

        // Mock
        jest.spyOn(User, "create").mockImplementation().mockReturnValue(testUser);
        jest.spyOn(bcrypt, "hash").mockReturnValue(PASSWORDS.VALID_PASSWORD);
        const nextFunc = jest.fn();

        // Test
        await authController.signup(req, res, nextFunc);
        expect(nextFunc).toBeCalledTimes(1);
        expect(nextFunc).toBeCalledWith(error);
    });
});