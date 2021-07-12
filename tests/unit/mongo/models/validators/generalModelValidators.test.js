import { beforeAll, afterAll, describe, test, expect } from "@jest/globals";
import mongoose from "mongoose";
import { USER_MODEL_NAME, USER_MODEL_FIELDS } from "../../../../../constants/userConstants.js";
import User from "../../../../../models/userModel.js";
import * as generalModelValidators from "../../../../../models/validators/generalModelValidators.js";
import { EMAILS, PASSWORDS, USERNAMES, HANDLES } from "../../../testConstants/userConstants.js";
import { closeMemoryServerDatabase, connectToMongoMemoryServer } from "../../server/memoryServer.js";

beforeAll(async () => await setup());
afterAll(async () => await teardown());
let userObjectId;

/**
 * Setup test environment before any tests run.
 */
const setup = async () => {
    await connectToMongoMemoryServer();
    const validUser = {
        [USER_MODEL_FIELDS.EMAIL]: EMAILS.VALID_EMAIL,
        [USER_MODEL_FIELDS.PASSWORD]: PASSWORDS.VALID_PASSWORD,
        [USER_MODEL_FIELDS.USERNAME]: USERNAMES.VALID_USERNAME_ALPHANUM,
        [USER_MODEL_FIELDS.HANDLE]: HANDLES.VALID_HANDLE
    };
    const newUser = await User.create(validUser);
    userObjectId = newUser._id;
};

/**
 * Clean test environment after all tests have executed.
 */
const teardown = async () => {
    await closeMemoryServerDatabase();
};

describe("General Model Validators", () => {
    describe("isValidRef", () => {
        test("returns true if given model contains a document with matching mongoose ObjectId", async () => {
            const res = await generalModelValidators.isValidRef(USER_MODEL_NAME, userObjectId);
            expect(res).toBeTruthy();
        });

        test("returns false if given model does contain a document with matching mongoose ObjectId", async () => {
            // Var
            const invalidId = mongoose.Types.ObjectId();
            
            // Test
            const res = await generalModelValidators.isValidRef(USER_MODEL_NAME, invalidId);
            expect(res).toBeFalsy();
        });

        test("returns false if given model does exist in database", async () => {
            // Var
            const invalidModelName = "Invalid name";
            
            // Test
            const res = await generalModelValidators.isValidRef(invalidModelName, userObjectId);
            expect(res).toBeFalsy();
        });
    });

    describe("areValidRefs", () => {
        test("returns true if given model contains matching documents for all given mongoose ObjectIds", async () => {
            const res = await generalModelValidators.areValidRefs(USER_MODEL_NAME, [userObjectId, userObjectId]);
            expect(res).toBeTruthy();
        });

        test("returns false if given model does not contain matching documents for all given mongoose ObjectIds", async () => {
            // Var
            const invalidId = mongoose.Types.ObjectId();
            
            // Test
            const res = await generalModelValidators.areValidRefs(USER_MODEL_NAME, [userObjectId, invalidId]);
            expect(res).toBeFalsy();
        });

        test("returns false if given model does exist in database", async () => {
            // Var
            const invalidModelName = "Invalid name";
            
            // Test
            const res = await generalModelValidators.areValidRefs(invalidModelName, [userObjectId, userObjectId]);
            expect(res).toBeFalsy();
        });
    });
});