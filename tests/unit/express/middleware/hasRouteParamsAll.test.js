import { jest, describe, test, expect, afterEach } from "@jest/globals";
import { HAS_ROUTE_PARAMS_ALL_CONSTANTS } from "../../../../constants/middlewareConstants.js";
import RESPONSE_CODES from "../../../../constants/responseCodes.js";
import * as middleware from "../../../../middleware/hasRouteParamsAll.js";
import { mockResponse } from "../../testConstants/generalConstants.js";

afterEach(() => jest.restoreAllMocks());

describe("hasRouteParamsAll middleware", () => {
    test("Calls next middleware if request params has all required keys", () => {
        // Var
        const testParam = "testParam";
        const req = {params: {[testParam]: "Test"}};
        const res = mockResponse();

        // Mock
        const hasParamsSpy = jest.spyOn(middleware, "default");
        const nextFunc = jest.fn();

        // Test
        middleware.default(req, res, nextFunc, [testParam]);
        expect(hasParamsSpy).toHaveBeenCalledTimes(1);
        expect(nextFunc).toHaveBeenCalledTimes(1);
    });

    test("Returns 400 if request does not have params", () => {
        // Var
        const req = {};
        const res = mockResponse();
        const expectedResponse = {
            ...RESPONSE_CODES.CLIENT_ERROR.BAD_REQUEST,
            message: HAS_ROUTE_PARAMS_ALL_CONSTANTS.NO_PARAMS
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
        const testParam = "testParam";
        const missingParam = "Test2";
        const req = {params: {[testParam]: "Test"}};
        const res = mockResponse();
        const expectedResponse = {
            ...RESPONSE_CODES.CLIENT_ERROR.BAD_REQUEST,
            message: HAS_ROUTE_PARAMS_ALL_CONSTANTS.MISSING_PARAMS([missingParam])
        };

        // Mock
        const hasParamsSpy = jest.spyOn(middleware, "default");

        // Test
        const result = middleware.default(req, res, () => { }, [testParam, missingParam]);
        expect(hasParamsSpy).toHaveBeenCalledTimes(1);
        expect(result.status).toEqual(expectedResponse.code);
        expect(result.body).toEqual(expectedResponse);
    });

});