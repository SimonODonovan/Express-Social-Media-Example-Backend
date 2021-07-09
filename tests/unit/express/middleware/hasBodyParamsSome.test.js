import { jest, describe, test, expect, afterEach } from "@jest/globals";
import { HAS_BODY_PARAMS_SOME_CONSTANTS } from "../../../../constants/middlewareConstants.js";
import RESPONSE_CODES from "../../../../constants/responseCodes.js";
import * as middleware from "../../../../middleware/hasBodyParamsSome.js";
import { mockResponse } from "../../testConstants/generalConstants.js";

afterEach(() => jest.restoreAllMocks());

describe("hasBodyParamsSome middleware", () => {
    test("Calls next middleware if request body has at least one required key", () => {
        // Var
        const testParam = "testParam";
        const missingParam = "missingParam";
        const req = { body: { [testParam]: "Test" } };
        const res = mockResponse();

        // Mock
        const hasParamsSpy = jest.spyOn(middleware, "default");
        const nextFunc = jest.fn();

        // Test
        middleware.default(req, res, nextFunc, [testParam, missingParam]);
        expect(hasParamsSpy).toHaveBeenCalledTimes(1);
        expect(nextFunc).toHaveBeenCalledTimes(1);
    });

    test("Calls next middleware if request body has all required keys", () => {
        // Var
        const testParam = "testParam";
        const testParam2 = "testParam2";
        const req = { body: { [testParam]: "Test", [testParam2]: "Test" } };
        const res = mockResponse();

        // Mock
        const hasParamsSpy = jest.spyOn(middleware, "default");
        const nextFunc = jest.fn();

        // Test
        middleware.default(req, res, nextFunc, [testParam, testParam2]);
        expect(hasParamsSpy).toHaveBeenCalledTimes(1);
        expect(nextFunc).toHaveBeenCalledTimes(1);
    });

    test("Returns 400 if request does not have body", () => {
        // Var
        const req = {};
        const res = mockResponse();
        const expectedResponse = {
            ...RESPONSE_CODES.CLIENT_ERROR.BAD_REQUEST,
            message: HAS_BODY_PARAMS_SOME_CONSTANTS.NO_BODY
        };

        // Mock
        const hasParamsSpy = jest.spyOn(middleware, "default");

        // Test
        const result = middleware.default(req, res, () => { }, []);
        expect(hasParamsSpy).toHaveBeenCalledTimes(1);
        expect(result.status).toEqual(expectedResponse.code);
        expect(result.body).toEqual(expectedResponse);
    });

    test("Returns 400 if request body does not contain any required keys", () => {
        // Var
        const testParam = "testParam";
        const missingParam = "Test2";
        const req = { body: { [testParam]: "Test" } };
        const res = mockResponse();
        const expectedResponse = {
            ...RESPONSE_CODES.CLIENT_ERROR.BAD_REQUEST,
            message: HAS_BODY_PARAMS_SOME_CONSTANTS.MISSING_PARAMS([missingParam])
        };

        // Mock
        const hasParamsSpy = jest.spyOn(middleware, "default");

        // Test
        const result = middleware.default(req, res, () => { }, [missingParam]);
        expect(hasParamsSpy).toHaveBeenCalledTimes(1);
        expect(result.status).toEqual(expectedResponse.code);
        expect(result.body).toEqual(expectedResponse);
    });

});