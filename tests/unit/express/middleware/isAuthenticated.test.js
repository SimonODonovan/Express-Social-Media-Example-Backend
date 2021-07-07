import { jest, describe, test, expect, afterEach } from "@jest/globals";
import RESPONSE_CODES from "../../../../constants/responseCodes.js";
import * as middleware from "../../../../middleware/isAuthenticated.js";
import { mockResponse } from "../../testConstants/generalConstants.js";

afterEach(() => jest.restoreAllMocks());

describe("isAuthenticated middleware", () => {
    test("Calls next middleware if request authentication returns true", () => {
        // Var
        const req = {isAuthenticated: () => true};

        // Mock
        const mwIsAuthenticatedSpy = jest.spyOn(middleware, "default");
        const reqIsAuthenticatedSpy = jest.spyOn(req, "isAuthenticated");
        const nextFunc = jest.fn();

        // Test
        middleware.default(req, {}, nextFunc);
        expect(mwIsAuthenticatedSpy).toHaveBeenCalledTimes(1);
        expect(reqIsAuthenticatedSpy).toHaveBeenCalledTimes(1);
        expect(nextFunc).toHaveBeenCalledTimes(1);
    });

    test("Returns 401 if request authorization does not return true", () => {
        // Var
        const req = {isAuthenticated: () => false};
        const res = mockResponse();
        const expectedResponse = RESPONSE_CODES.CLIENT_ERROR.UNAUTHORIZED;

        // Mock
        const mwIsAuthenticatedSpy = jest.spyOn(middleware, "default");
        const reqIsAuthenticatedSpy = jest.spyOn(req, "isAuthenticated");
        const nextFunc = jest.fn();

        // Test
        const result = middleware.default(req, res, nextFunc);
        expect(mwIsAuthenticatedSpy).toHaveBeenCalledTimes(1);
        expect(reqIsAuthenticatedSpy).toHaveBeenCalledTimes(1);
        expect(nextFunc).not.toHaveBeenCalled();
        expect(result.status).toEqual(expectedResponse.code);
        expect(result.body).toEqual(expectedResponse);
    });

});