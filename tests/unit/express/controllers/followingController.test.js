import { afterEach, describe, test, expect, jest } from "@jest/globals";
import Following from "../../../../models/followingModel.js";
import RESPONSE_CODES from "../../../../constants/responseCodes.js";
import mongoose from "mongoose";
import { FOLLOWING_MODEL_FIELDS, SUCCESS_MESSAGES, FOLLOWING_ID } from "../../../../constants/followingConstants.js";
import * as followingController from "../../../../controllers/followingController.js";
import { mockResponse } from "../../testConstants/generalConstants.js";


afterEach(() => jest.restoreAllMocks());

describe("Following Controller", () => {

    describe("createFollowing", () => {
        test("Returns 201 after creating following successfully", async () => {
            // Var
            const req = {
                body: {
                    [FOLLOWING_MODEL_FIELDS.FOLLOWER]: mongoose.Types.ObjectId(),
                    [FOLLOWING_MODEL_FIELDS.FOLLOWING]: mongoose.Types.ObjectId()
                }
            };
            const res = mockResponse();
            const expectedRes = {
                ...RESPONSE_CODES.SUCCESS.CREATED,
                message: SUCCESS_MESSAGES.CREATED_FOLLOWING
            };

            // Mock
            const createFollowingSpy = jest.spyOn(Following, "create").mockImplementation();

            // Test
            const response = await followingController.createFollowing(req, res);
            expect(createFollowingSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });

        test("Returns 500 if exception occurs", async () => {
            // Var
            const req = {
                body: {
                    [FOLLOWING_MODEL_FIELDS.FOLLOWER]: mongoose.Types.ObjectId(),
                    [FOLLOWING_MODEL_FIELDS.FOLLOWING]: mongoose.Types.ObjectId()
                }
            };
            const res = mockResponse();
            const errorMessage = "Error message";
            const expectedRes = {
                ...RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR,
                message: errorMessage
            };

            // Mock
            const createFollowingSpy = jest
                .spyOn(Following, "create")
                .mockRejectedValue(new Error(errorMessage));

            // Test
            const response = await followingController.createFollowing(req, res);
            expect(createFollowingSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });
    });

    describe("getFollowings", () => {
        test("Returns 200 and followings data successful query with results", async () => {
            // Var
            const req = {
                body: {
                    [FOLLOWING_MODEL_FIELDS.FOLLOWER]: mongoose.Types.ObjectId(),
                    [FOLLOWING_MODEL_FIELDS.FOLLOWING]: mongoose.Types.ObjectId()
                }
            };
            const res = mockResponse();
            const expectedData = { key: "val" };
            const expectedRes = {
                ...RESPONSE_CODES.SUCCESS.OK,
                data: [expectedData]
            };

            // Mock
            const findFollowingSpy = jest
                .spyOn(Following, "find")
                .mockResolvedValue([expectedData]);

            // Test
            const response = await followingController.getFollowings(req, res);
            expect(findFollowingSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });

        test("Returns 404 successful query with no results", async () => {
            // Var
            const req = {
                body: {}
            };
            const res = mockResponse();
            const expectedRes = RESPONSE_CODES.CLIENT_ERROR.NOT_FOUND;

            // Mock
            const findFollowingSpy = jest
                .spyOn(Following, "find")
                .mockResolvedValue([]);

            // Test
            const response = await followingController.getFollowings(req, res);
            expect(findFollowingSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });

        test("Returns 500 on exception", async () => {
            // Var
            const errorMessage = "Error message";
            const req = {
                body: {
                    [FOLLOWING_MODEL_FIELDS.FOLLOWER]: mongoose.Types.ObjectId(),
                    [FOLLOWING_MODEL_FIELDS.FOLLOWING]: mongoose.Types.ObjectId()
                }
            };
            const res = mockResponse();
            const expectedRes = {
                ...RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR,
                message: errorMessage
            };

            // Mock
            const findFollowingSpy = jest
                .spyOn(Following, "find")
                .mockRejectedValue(new Error(errorMessage));

            // Test
            const response = await followingController.getFollowings(req, res);
            expect(findFollowingSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });
    });

    describe("getFollowingById", () => {
        test("Returns 200 and following data successful query", async () => {
            // Var
            const req = {params: {[FOLLOWING_ID]: mongoose.Types.ObjectId()}};
            const res = mockResponse();
            const expectedData = { key: "val" };
            const expectedRes = {
                ...RESPONSE_CODES.SUCCESS.OK,
                data: expectedData
            };

            // Mock
            const findFollowingSpy = jest
                .spyOn(Following, "findById")
                .mockResolvedValue(expectedData);

            // Test
            const response = await followingController.getFollowingById(req, res);
            expect(findFollowingSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });

        test("Returns 404 if following does not exist", async () => {
            // Var
            const req = {params: {[FOLLOWING_ID]: mongoose.Types.ObjectId()}};
            const res = mockResponse();
            const expectedRes = RESPONSE_CODES.CLIENT_ERROR.NOT_FOUND;

            // Mock
            const findFollowingSpy = jest
                .spyOn(Following, "findById")
                .mockResolvedValue(null);

            // Test
            const response = await followingController.getFollowingById(req, res);
            expect(findFollowingSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });

        test("Returns 500 if exception occurs", async () => {
            // Var
            const errorMessage = "Error message";
            const req = {params: {[FOLLOWING_ID]: mongoose.Types.ObjectId()}};
            const res = mockResponse();
            const expectedRes = {
                ...RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR,
                message: errorMessage
            };

            // Mock
            const findFollowingSpy = jest
                .spyOn(Following, "findById")
                .mockRejectedValue(new Error(errorMessage));

            // Test
            const response = await followingController.getFollowingById(req, res);
            expect(findFollowingSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });
    });

    describe("deleteFollowingById", () => {
        test("Returns 204 on successful delete", async () => {
            // Var
            const req = {params: {[FOLLOWING_ID]: mongoose.Types.ObjectId()}};
            const res = mockResponse();
            const expectedRes = RESPONSE_CODES.SUCCESS.NO_CONTENT;

            // Mock
            const findFollowingSpy = jest
                .spyOn(Following, "findByIdAndDelete")
                .mockResolvedValue({ doc: "doc" });

            // Test
            const response = await followingController.deleteFollowingById(req, res);
            expect(findFollowingSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });

        test("Returns 404 if following does not exist", async () => {
            // Var
            const req = {params: {[FOLLOWING_ID]: mongoose.Types.ObjectId()}};
            const res = mockResponse();
            const expectedRes = RESPONSE_CODES.CLIENT_ERROR.NOT_FOUND;

            // Mock
            const findFollowingSpy = jest
                .spyOn(Following, "findByIdAndDelete")
                .mockResolvedValue(null);

            // Test
            const response = await followingController.deleteFollowingById(req, res);
            expect(findFollowingSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });

        test("Returns 500 if exception occurs", async () => {
            // Var
            const errorMessage = "Error message";
            const req = {
                params: {
                    [FOLLOWING_ID]: mongoose.Types.ObjectId(),
                }
            };
            const res = mockResponse();
            const expectedRes = {
                ...RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR,
                message: errorMessage
            };

            // Mock
            const findFollowingSpy = jest
                .spyOn(Following, "findByIdAndDelete")
                .mockRejectedValue(new Error(errorMessage));

            // Test
            const response = await followingController.deleteFollowingById(req, res);
            expect(findFollowingSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });
    });
});