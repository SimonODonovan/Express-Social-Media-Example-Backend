import { jest, describe, test, expect, afterEach } from "@jest/globals";
import { hasParamsConstants } from "../../../../constants/middlewareConstants.js";
import RESPONSE_CODES from "../../../../constants/responseCodes.js";
import * as middleware from "../../../../middleware/hasParams.js";
import { mockResponse } from "../../testConstants/generalConstants.js";

afterEach(() => jest.restoreAllMocks());

describe("hasParams middleware", () => {
    test("Calls next middleware if request has all required params", () => {
        // Var
        const req = {params: {testParam1: "Test"}};
        const res = mockResponse();

        // Mock
        const hasParamsSpy = jest.spyOn(middleware, "default");
        const nextFunc = jest.fn();

        // Test
        middleware.default(req, res, nextFunc, ["testParam1"]);
        expect(hasParamsSpy).toHaveBeenCalledTimes(1);
        expect(nextFunc).toHaveBeenCalledTimes(1);
    });

    test("Returns 400 if request does not have params", () => {
        // Var
        const req = {};
        const res = mockResponse();
        const expectedResponse = {
            ...RESPONSE_CODES.CLIENT_ERROR.BAD_REQUEST,
            message: hasParamsConstants.noParams
        };

        // Mock
        const hasParamsSpy = jest.spyOn(middleware, "default");

        // Test
        const result = middleware.default(req, res, () => { }, []);
        expect(hasParamsSpy).toHaveBeenCalledTimes(1);
        expect(result.status).toEqual(expectedResponse.code);
        expect(result.body).toEqual(expectedResponse);
    });

    test("Returns 400 if request does not contain expected params", () => {
        // Var
        const missingParam = "Test2";
        const req = {params: {testParam1: "Test"}};
        const res = mockResponse();
        const expectedResponse = {
            ...RESPONSE_CODES.CLIENT_ERROR.BAD_REQUEST,
            message: hasParamsConstants.missingParams([missingParam])
        };

        // Mock
        const hasParamsSpy = jest.spyOn(middleware, "default");

        // Test
        const result = middleware.default(req, res, () => { }, ["testParam1", missingParam]);
        expect(hasParamsSpy).toHaveBeenCalledTimes(1);
        expect(result.status).toEqual(expectedResponse.code);
        expect(result.body).toEqual(expectedResponse);
    });

});