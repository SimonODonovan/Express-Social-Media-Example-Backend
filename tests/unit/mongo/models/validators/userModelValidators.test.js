import { beforeAll, afterAll, describe, test, expect } from "@jest/globals";
import User from "../../../../../models/userModel.js";
import * as userModelValidators from "../../../../../models/validators/userModelValidators.js";
import { EMAILS, PASSWORDS, USERNAMES, HANDLES } from "../../../testConstants/userConstants.js";
import { closeMemoryServerDatabase, connectToMongoMemoryServer } from "../../server/memoryServer.js";

beforeAll(async () => await setup());
afterAll(async () => await teardown());

/**
 * Setup test environment before any tests run.
 */
const setup = async () => {
    await connectToMongoMemoryServer();
    const validUser = {
        email: EMAILS.VALID_EMAIL,
        password: PASSWORDS.VALID_PASSWORD,
        username: USERNAMES.VALID_USERNAME_ALPHANUM,
        handle: HANDLES.VALID_HANDLE
    };
    await User.create(validUser);
};

/**
 * Clean test environment after all tests have executed.
 */
const teardown = async () => {
    await closeMemoryServerDatabase();
};

describe("User Model Validators", () => {
    describe("emailInUse", () => {
        test("returns true if email is already assigned to an existing User", async () => {
            // Var
            const email = EMAILS.VALID_EMAIL_ALT;

            // Test
            const res = await userModelValidators.emailInUse(email);
            expect(res).toBeTruthy();
        });

        test("returns false if email is not assigned to an existing User", async () => {
            // Var
            const email = EMAILS.VALID_EMAIL;

            // Test
            const res = await userModelValidators.emailInUse(email);
            expect(res).toBeFalsy();
        });
    });

    describe("handleInUse", () => {
        test("returns true if handle is already assigned to an existing User", async () => {
            // Var
            const handle = HANDLES.VALID_HANDLE_ALT;

            // Test
            const res = await userModelValidators.handleInUse(handle);
            expect(res).toBeTruthy();
        });

        test("returns false if handle is not assigned to an existing User", async () => {
            // Var
            const handle = HANDLES.VALID_HANDLE;

            // Test
            const res = await userModelValidators.handleInUse(handle);
            expect(res).toBeFalsy();
        });
    });

    describe("validateHandleWhitespace", () => {
        test("returns true if handle does not contain whitespace", () => {
            // Var
            const handle = HANDLES.VALID_HANDLE_ALT;

            // Test
            const res = userModelValidators.validateHandleWhitespace(handle);
            expect(res).toBeTruthy();
        });

        test("returns false if handle contains whitespace", () => {
            // Var
            const handle = HANDLES.INVALID_HANDLE_INNER_WHITESPACE_NOTRIM;

            // Test
            const res = userModelValidators.validateHandleWhitespace(handle);
            expect(res).toBeFalsy();
        });
    });
});