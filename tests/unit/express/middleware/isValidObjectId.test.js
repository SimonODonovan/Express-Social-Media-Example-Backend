import { jest, describe, test, expect, afterEach } from "@jest/globals";
import RESPONSE_CODES from "../../../../constants/responseCodes.js";
import * as middleware from "../../../../middleware/isValidObjectId.js";
import { mockResponse } from "../../testConstants/generalConstants.js";
import { isValidObjectIdConstants } from "../../../../constants/middlewareConstants.js";
import mongoose from "mongoose";

afterEach(() => jest.restoreAllMocks());

describe("isValidObjectId middleware", () => {
    test("Calls next middleware if value is a valid mongoose Object ID", () => {
        // Var
        const value = mongoose.Types.ObjectId();

        // Mock
        const isValidObjectIdSpy = jest.spyOn(middleware, "default");
        const nextFunc = jest.fn();

        // Test
        middleware.default({}, {}, nextFunc, value);
        expect(isValidObjectIdSpy).toHaveBeenCalledTimes(1);
        expect(nextFunc).toHaveBeenCalledTimes(1);
    });

    test("Returns 400 value is not a valid mongoose Object ID", () => {
        // Var
        const value = "Test value";
        const res = mockResponse();
        const expectedResponse = {
            ...RESPONSE_CODES.CLIENT_ERROR.BAD_REQUEST,
            message: isValidObjectIdConstants.invalidObjectId 
        };

        // Mock
        const mwIsAuthenticatedSpy = jest.spyOn(middleware, "default");
        const nextFunc = jest.fn();

        // Test
        const result = middleware.default({}, res, nextFunc, value);
        expect(mwIsAuthenticatedSpy).toHaveBeenCalledTimes(1);
        expect(nextFunc).not.toHaveBeenCalled();
        expect(result.status).toEqual(expectedResponse.code);
        expect(result.body).toEqual(expectedResponse);
    });

});