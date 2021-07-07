import { beforeAll, afterEach, afterAll, describe, test, expect } from "@jest/globals";
import { connectToMongoMemoryServer, closeMemoryServerDatabase, clearMemoryServerDatabase } from "../server/memoryServer.js";
import User from "../../../../models/userModel.js";
import { EMAILS, PASSWORDS, USERNAMES, HANDLES } from "../../testConstants/userConstants.js";
import { VALIDATION_MESSAGES } from "../../../../constants/userConstants.js";

beforeAll(() => connectToMongoMemoryServer());
afterEach(() => clearMemoryServerDatabase());
afterAll(() => closeMemoryServerDatabase());

describe("User Model", () => {
    test("Create user", async () => {
        // Var
        const validUser = {
            email: EMAILS.VALID_EMAIL,
            password: PASSWORDS.VALID_PASSWORD,
            username: USERNAMES.VALID_USERNAME_ALPHANUM,
            handle: HANDLES.VALID_HANDLE
        };

        // Test
        await User.create(validUser);
        const allUsers = await User.find({});
        expect(allUsers.length).toEqual(1);
        const foundUser = allUsers[0];
        expect(foundUser.email).toEqual(EMAILS.VALID_EMAIL);
        expect(foundUser.password).toEqual(PASSWORDS.VALID_PASSWORD);
        expect(foundUser.username).toEqual(USERNAMES.VALID_USERNAME_ALPHANUM);
        expect(foundUser.handle).toEqual(HANDLES.VALID_HANDLE);
    });

    test("Fail on missing email", async () => {
        // Var
        const invalidUser = {
            password: PASSWORDS.VALID_PASSWORD,
            username: USERNAMES.VALID_USERNAME_ALPHANUM,
            handle: HANDLES.VALID_HANDLE
        };

        // Test
        await expect(User.create(invalidUser)).rejects.toThrow(VALIDATION_MESSAGES.EMAIL_REQUIRED);
        const allUsers = await User.find({});
        expect(allUsers.length).toEqual(0);
    });

    test("Fail on missing password", async () => {
        // Var
        const invalidUser = {
            email: EMAILS.VALID_EMAIL,
            username: USERNAMES.VALID_USERNAME_ALPHANUM,
            handle: HANDLES.VALID_HANDLE
        };

        // Test
        await expect(User.create(invalidUser)).rejects.toThrow(VALIDATION_MESSAGES.PASSWORD_REQUIRED);
        const allUsers = await User.find({});
        expect(allUsers.length).toEqual(0);
    });

    test("Fail on missing username", async () => {
        // Var
        const invalidUser = {
            email: EMAILS.VALID_EMAIL,
            password: PASSWORDS.VALID_PASSWORD,
            handle: HANDLES.VALID_HANDLE
        };

        // Test
        await expect(User.create(invalidUser)).rejects.toThrow(VALIDATION_MESSAGES.USERNAME_REQUIRED);
        const allUsers = await User.find({});
        expect(allUsers.length).toEqual(0);
    });

    test("Fail on missing handle", async () => {
        // Var
        const invalidUser = {
            email: EMAILS.VALID_EMAIL,
            password: PASSWORDS.VALID_PASSWORD,
            username: USERNAMES.VALID_USERNAME_ALPHANUM,
        };

        // Test
        await expect(User.create(invalidUser)).rejects.toThrow(VALIDATION_MESSAGES.HANDLE_REQUIRED);
        const allUsers = await User.find({});
        expect(allUsers.length).toEqual(0);
    });

    test("Fail when username less than min characters", async () => {
        // Var
        const invalidUser = {
            email: EMAILS.VALID_EMAIL,
            password: PASSWORDS.VALID_PASSWORD,
            username: USERNAMES.INVALID_USERNAME_TOO_SHORT,
            handle: HANDLES.VALID_HANDLE
        };

        // Test
        await expect(User.create(invalidUser)).rejects.toThrow(VALIDATION_MESSAGES.USERNAME_TOO_SHORT);
        const allUsers = await User.find({});
        expect(allUsers.length).toEqual(0);
    });

    test("Fail when username greater than max characters", async () => {
        // Var
        const invalidUser = {
            email: EMAILS.VALID_EMAIL,
            password: PASSWORDS.VALID_PASSWORD,
            username: USERNAMES.INVALID_USERNAME_TOO_LONG,
            handle: HANDLES.VALID_HANDLE
        };

        // Test
        await expect(User.create(invalidUser)).rejects.toThrow(VALIDATION_MESSAGES.USERNAME_TOO_LONG);
        const allUsers = await User.find({});
        expect(allUsers.length).toEqual(0);
    });

    test("Fail when handle less than min characters", async () => {
        // Var
        const invalidUser = {
            email: EMAILS.VALID_EMAIL,
            password: PASSWORDS.VALID_PASSWORD,
            username: USERNAMES.VALID_USERNAME_ALPHANUM,
            handle: HANDLES.INVALID_HANDLE_TOO_SHORT
        };

        // Test
        await expect(User.create(invalidUser)).rejects.toThrow(VALIDATION_MESSAGES.HANDLE_TOO_SHORT);
        const allUsers = await User.find({});
        expect(allUsers.length).toEqual(0);
    });

    test("Fail when handle greater than max characters", async () => {
        // Var
        const invalidUser = {
            email: EMAILS.VALID_EMAIL,
            password: PASSWORDS.VALID_PASSWORD,
            username: USERNAMES.VALID_USERNAME_ALPHANUM,
            handle: HANDLES.INVALID_HANDLE_TOO_LONG
        };

        // Test
        await expect(User.create(invalidUser)).rejects.toThrow(VALIDATION_MESSAGES.HANDLE_TOO_LONG);
        const allUsers = await User.find({});
        expect(allUsers.length).toEqual(0);
    });

    test("Fail with an invalid email no @", async () => {
        // Var
        const invalidUser = {
            email: EMAILS.INVALID_EMAIL_NO_AT,
            password: PASSWORDS.VALID_PASSWORD,
            username: USERNAMES.VALID_USERNAME_ALPHANUM,
            handle: HANDLES.VALID_HANDLE
        };

        // Test
        await expect(User.create(invalidUser)).rejects.toThrow(VALIDATION_MESSAGES.EMAIL_INVALID);
        const allUsers = await User.find({});
        expect(allUsers.length).toEqual(0);
    });

    test("Fail with an invalid email no sub-domain", async () => {
        // Var
        const invalidUser = {
            email: EMAILS.INVALID_EMAIL_NO_DOMAIN,
            password: PASSWORDS.VALID_PASSWORD,
            username: USERNAMES.VALID_USERNAME_ALPHANUM,
            handle: HANDLES.VALID_HANDLE
        };

        // Test
        await expect(User.create(invalidUser)).rejects.toThrow(VALIDATION_MESSAGES.EMAIL_INVALID);
        const allUsers = await User.find({});
        expect(allUsers.length).toEqual(0);
    });

    test("Fail with an invalid email no top-domain", async () => {
        // Var
        const invalidUser = {
            email: EMAILS.INVALID_EMAIL_NO_TOP_DOMAIN,
            password: PASSWORDS.VALID_PASSWORD,
            username: USERNAMES.VALID_USERNAME_ALPHANUM,
            handle: HANDLES.VALID_HANDLE
        };

        // Test
        await expect(User.create(invalidUser)).rejects.toThrow(VALIDATION_MESSAGES.EMAIL_INVALID);
        const allUsers = await User.find({});
        expect(allUsers.length).toEqual(0);
    });

    test("Fail when email is in-use", async () => {
        // Var
        const validUser = {
            email: EMAILS.VALID_EMAIL,
            password: PASSWORDS.VALID_PASSWORD,
            username: USERNAMES.VALID_USERNAME_ALPHANUM,
            handle: HANDLES.VALID_HANDLE
        };
        const userSameEmail = {
            ...validUser,
            handle: HANDLES.VALID_HANDLE_ALT
        };

        // Test
        await User.create(validUser);
        await expect(User.create(userSameEmail)).rejects.toThrow(VALIDATION_MESSAGES.EMAIL_INUSE);
        const allUsers = await User.find({});
        expect(allUsers.length).toEqual(1);
    });

    test("Fail when handle is in-use", async () => {
        // Var
        const validUser = {
            email: EMAILS.VALID_EMAIL,
            password: PASSWORDS.VALID_PASSWORD,
            username: USERNAMES.VALID_USERNAME_ALPHANUM,
            handle: HANDLES.VALID_HANDLE
        };
        const userSameHandle = {
            ...validUser,
            email: EMAILS.VALID_EMAIL_ALT
        };

        // Test
        await User.create(validUser);
        await expect(User.create(userSameHandle)).rejects.toThrow(VALIDATION_MESSAGES.HANDLE_INUSE);
        const allUsers = await User.find({});
        expect(allUsers.length).toEqual(1);
    });

    test("Fail when handle has whitespace", async () => {
        // Var
        const invalidUser = {
            email: EMAILS.VALID_EMAIL,
            password: PASSWORDS.VALID_PASSWORD,
            username: USERNAMES.VALID_USERNAME_ALPHANUM,
            handle: HANDLES.INVALID_HANDLE_INNER_WHITESPACE
        };

        // Test
        await expect(User.create(invalidUser)).rejects.toThrow(VALIDATION_MESSAGES.HANDLE_INVALID_WHITESPACE);
        const allUsers = await User.find({});
        expect(allUsers.length).toEqual(0);
    });

    test("Do not fail with non-english handle", async () => {
        // Var
        const nonEnglishHandles = HANDLES.VALID_HANDLE_NON_ENGLISH;
        const invalidUser = {
            password: PASSWORDS.VALID_PASSWORD,
            username: USERNAMES.VALID_USERNAME_ALPHANUM
        };
        let index = 0;

        // Test
        for (const nonEnglishHandle of Object.values(nonEnglishHandles)) {
            invalidUser.email = `email${index++}@address.com`;
            invalidUser.handle = nonEnglishHandle;
            await User.create(invalidUser);
        }
        const allUsers = await User.find({});
        expect(allUsers.length).toEqual(3);
    });
});