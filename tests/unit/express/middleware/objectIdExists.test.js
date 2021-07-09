import { jest, describe, test, expect, afterEach, beforeAll, afterAll } from "@jest/globals";
import RESPONSE_CODES from "../../../../constants/responseCodes.js";
import * as middleware from "../../../../middleware/objectIdExists.js";
import { mockResponse } from "../../testConstants/generalConstants.js";
import { OBJECT_ID_EXISTS_CONSTANTS } from "../../../../constants/middlewareConstants.js";
import User from "../../../../models/userModel.js";
import {USER_MODEL_NAME} from "../../../../constants/userConstants.js";
import {EMAILS, PASSWORDS, USERNAMES, HANDLES} from "../../testConstants/userConstants.js";
import {connectToMongoMemoryServer, clearMemoryServerDatabase, closeMemoryServerDatabase} from "../../mongo/server/memoryServer.js";
import mongoose from "mongoose";

beforeAll(() => setup());
afterEach(() => jest.restoreAllMocks());
afterAll(() => teardown());

var testUserId;

const setup = async () => {
    await connectToMongoMemoryServer();
    const testUser = await User.create({
        email: EMAILS.VALID_EMAIL,
        password: PASSWORDS.VALID_PASSWORD,
        username: USERNAMES.VALID_USERNAME_ALPHANUM,
        handle: HANDLES.VALID_HANDLE
    });
    testUserId = testUser._id;
};

/**
 * Clean test environment after all tests have executed.
 */
const teardown = async () => {
    await clearMemoryServerDatabase();
    await closeMemoryServerDatabase();
};

describe("isValidObjectId middleware", () => {
    test("Calls next middleware if ObjectId is found in model", async() => {
        // Var
        const res = mockResponse();

        // Mock
        const objectIdExistsSpy = jest.spyOn(middleware, "default");
        const nextFunc = jest.fn();

        // Test
        await middleware.default({}, res, nextFunc, testUserId, USER_MODEL_NAME);
        expect(objectIdExistsSpy).toHaveBeenCalledTimes(1);
        expect(nextFunc).toHaveBeenCalledTimes(1);
    });

    test("Returns 400 value if model does not exist", async() => {
        // Var
        const modelName = "Test name";
        const res = mockResponse();
        const expectedResponse = {
            ...RESPONSE_CODES.CLIENT_ERROR.BAD_REQUEST,
            message: OBJECT_ID_EXISTS_CONSTANTS.MODEL_DOES_NOT_EXIST(modelName)
        };

        // Mock
        const objectIdExistsSpy = jest.spyOn(middleware, "default");
        const nextFunc = jest.fn();

        // Test
        const result = await middleware.default({}, res, nextFunc, testUserId, modelName);
        expect(objectIdExistsSpy).toHaveBeenCalledTimes(1);
        expect(nextFunc).not.toHaveBeenCalled();
        expect(result.status).toEqual(expectedResponse.code);
        expect(result.body).toEqual(expectedResponse);
    });

    test("Returns 400 if no document in model has matching ObjectId", async() => {
        // Var
        const modelName = USER_MODEL_NAME;
        const invalidId = mongoose.Types.ObjectId();
        const res = mockResponse();
        const expectedResponse = {
            ...RESPONSE_CODES.CLIENT_ERROR.BAD_REQUEST,
            message: OBJECT_ID_EXISTS_CONSTANTS.ID_DOES_NOT_EXIST_IN_MODEL(invalidId, modelName)
        };

        // Mock
        const objectIdExistsSpy = jest.spyOn(middleware, "default");
        const nextFunc = jest.fn();

        // Test
        const result = await middleware.default({}, res, nextFunc, invalidId, modelName);
        expect(objectIdExistsSpy).toHaveBeenCalledTimes(1);
        expect(nextFunc).not.toHaveBeenCalled();
        expect(result.status).toEqual(expectedResponse.code);
        expect(result.body).toEqual(expectedResponse);
    });

});