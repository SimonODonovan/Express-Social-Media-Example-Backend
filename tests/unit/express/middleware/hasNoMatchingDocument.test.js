import { jest, describe, test, expect, afterEach, beforeAll } from "@jest/globals";
import { HAS_NO_MATCHING_DOCUMENTS_CONSTANTS } from "../../../../constants/middlewareConstants.js";
import RESPONSE_CODES from "../../../../constants/responseCodes.js";
import * as middleware from "../../../../middleware/hasNoMatchingDocument.js";
import { mockResponse } from "../../testConstants/generalConstants.js";
import mongoose from "mongoose";

beforeAll(() => setup());
afterEach(() => postTestCleanup());

let testModel;
const testModelName = "testModelName";

const setup = async () => {
    testModel = mongoose.model(testModelName, {});
};

const postTestCleanup = () => {
    jest.restoreAllMocks();
};

jest.setTimeout(1000000);

describe("hasNoMatchingDocument middleware",  () => {
    test("Calls next middleware if model does not exist", async() => {
        // Var
        const modelName = "testModel";
        const filter = { key: "val" };
        const res = mockResponse();

        // Mock
        const hasNoMatchingDocsSpy = jest.spyOn(middleware, "default");
        const nextFunc = jest.fn();

        // Test
        await middleware.default({}, res, nextFunc, modelName, filter);
        expect(hasNoMatchingDocsSpy).toHaveBeenCalledTimes(1);
        expect(nextFunc).toHaveBeenCalledTimes(1);
    });

    test("Calls next middleware if model filter does find any documents", async() => {
        // Var
        const filter = { key: "val" };
        const res = mockResponse();

        // Mock
        const hasNoMatchingDocsSpy = jest.spyOn(middleware, "default");
        const modelSpy = jest
            .spyOn(testModel, "find")
            .mockResolvedValue([]);
        const nextFunc = jest.fn();

        // Test
        await middleware.default({}, res, nextFunc, testModelName, filter);
        expect(hasNoMatchingDocsSpy).toHaveBeenCalledTimes(1);
        expect(modelSpy).toHaveBeenCalledTimes(1);
        expect(nextFunc).toHaveBeenCalledTimes(1);
    });

    test("Return 400 if a matching document is found", async() => {
        // Var
        
        const filter = { key: "val" };
        const res = mockResponse();
        
        const expectedResponse = {
            ...RESPONSE_CODES.CLIENT_ERROR.BAD_REQUEST,
            message: HAS_NO_MATCHING_DOCUMENTS_CONSTANTS.HAS_MATCHING_DOCUMENT(testModelName, filter)
        };

        // Mock
        const hasNoMatchingDocsSpy = jest.spyOn(middleware, "default");
        const modelSpy = jest
            .spyOn(testModel, "find")
            .mockResolvedValue([{key: "val"}]);
        const nextFunc = jest.fn();

        // Test
        const result = await middleware.default({}, res, nextFunc, testModelName, filter);
        expect(hasNoMatchingDocsSpy).toHaveBeenCalledTimes(1);
        expect(modelSpy).toHaveBeenCalledTimes(1);
        expect(nextFunc).not.toHaveBeenCalled();
        expect(result.status).toEqual(expectedResponse.code);
        expect(result.body).toEqual(expectedResponse);
    });

});