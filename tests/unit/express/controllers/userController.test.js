import { afterEach, describe, test, expect, jest } from "@jest/globals";
import RESPONSE_CODES from "../../../../constants/responseCodes.js";
import * as userController from "../../../../controllers/userController.js";
import { mockResponse } from "../../testConstants/generalConstants.js";
import User from "../../../../models/userModel.js";
import { USER_MODEL_FIELDS } from "../../../../constants/userConstants.js";
import { EMAILS } from "../../testConstants/userConstants.js";

afterEach(() => jest.restoreAllMocks());

describe("User Controller", () => {

    describe("checkEmail", () => {
        test("Returns 200 and filled body data if user is with email is found", async () => {
            // Var
            const user = new User();
            const req = {
                params: { [USER_MODEL_FIELDS.EMAIL]: EMAILS.VALID_EMAIL },
            };
            const res = mockResponse();
            const expectedRes = {
                ...RESPONSE_CODES.SUCCESS.OK,
                data: user
            };

            // Mock
            const findOneUserSpy = jest.spyOn(User, "findOne").mockResolvedValue(user);

            // Test
            const response = await userController.checkEmail(req, res);
            expect(findOneUserSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });

        test("Returns 200 and null body data if user is with email is not found", async () => {
            // Var
            const req = {
                params: { [USER_MODEL_FIELDS.EMAIL]: EMAILS.VALID_EMAIL },
            };
            const res = mockResponse();
            const expectedRes = {
                ...RESPONSE_CODES.SUCCESS.OK,
                data: null
            };

            // Mock
            const findOneUserSpy = jest.spyOn(User, "findOne").mockResolvedValue(null);

            // Test
            const response = await userController.checkEmail(req, res);
            expect(findOneUserSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });

        test("Returns 500 if exception occurs", async () => {
            // Var
            const req = {
                params: { [USER_MODEL_FIELDS.EMAIL]: EMAILS.VALID_EMAIL },
            };
            const res = mockResponse();
            const errorMessage = "Error message";
            const expectedRes = {
                ...RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR,
                message: errorMessage
            };

            // Mock
            const findOneUserSpy = jest.spyOn(User, "findOne").mockRejectedValue(new Error(errorMessage));

            // Test
            const response = await userController.checkEmail(req, res);
            expect(findOneUserSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });
    });

});