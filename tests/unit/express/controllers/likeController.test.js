import { afterEach, describe, test, expect, jest } from "@jest/globals";
import Like from "../../../../models/likeModel.js";
import RESPONSE_CODES from "../../../../constants/responseCodes.js";
import mongoose from "mongoose";
import { SUCCESS_MESSAGES } from "../../../../constants/likeConstants.js";
import * as likeController from "../../../../controllers/likeController.js";
import { mockResponse } from "../../testConstants/generalConstants.js";
import { LIKE_ID, LIKE_MODEL_FIELDS } from "../../../../constants/likeConstants.js";

afterEach(() => jest.restoreAllMocks());

describe("Like Controller", () => {

    describe("createLike", () => {
        test("Returns 201 after creating like successfully", async () => {
            // Var
            const req = {
                body: {
                    [LIKE_MODEL_FIELDS.POST]: mongoose.Types.ObjectId(),
                    [LIKE_MODEL_FIELDS.USER]: mongoose.Types.ObjectId()
                }
            };
            const res = mockResponse();
            const expectedRes = {
                ...RESPONSE_CODES.SUCCESS.CREATED,
                message: SUCCESS_MESSAGES.CREATED_LIKE
            };

            // Mock
            const createLikeSpy = jest.spyOn(Like, "create").mockImplementation();

            // Test
            const response = await likeController.createLike(req, res);
            expect(createLikeSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });

        test("Returns 500 if exception occurs", async () => {
            // Var
            const req = {
                body: {
                    [LIKE_MODEL_FIELDS.POST]: mongoose.Types.ObjectId(),
                    [LIKE_MODEL_FIELDS.USER]: mongoose.Types.ObjectId()
                }
            };
            const res = mockResponse();
            const errorMessage = "Error message";
            const expectedRes = {
                ...RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR,
                message: errorMessage
            };

            // Mock
            const createLikeSpy = jest
                .spyOn(Like, "create")
                .mockRejectedValue(new Error(errorMessage));

            // Test
            const response = await likeController.createLike(req, res);
            expect(createLikeSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });
    });

    describe("getLikes", () => {
        test("Returns 200 and likes data successful query with results", async () => {
            // Var
            const req = {
                body: {
                    [LIKE_MODEL_FIELDS.POST]: mongoose.Types.ObjectId(),
                    [LIKE_MODEL_FIELDS.USER]: mongoose.Types.ObjectId()
                }
            };
            const res = mockResponse();
            const expectedData = { key: "val" };
            const expectedRes = {
                ...RESPONSE_CODES.SUCCESS.OK,
                data: [expectedData]
            };

            // Mock
            const findLikeSpy = jest
                .spyOn(Like, "find")
                .mockResolvedValue([expectedData]);

            // Test
            const response = await likeController.getLikes(req, res);
            expect(findLikeSpy).toHaveBeenCalledTimes(1);
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
            const findLikeSpy = jest
                .spyOn(Like, "find")
                .mockResolvedValue([]);

            // Test
            const response = await likeController.getLikes(req, res);
            expect(findLikeSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });

        test("Returns 500 on exception", async () => {
            // Var
            const errorMessage = "Error message";
            const req = {
                body: {
                    [LIKE_MODEL_FIELDS.POST]: mongoose.Types.ObjectId(),
                    [LIKE_MODEL_FIELDS.USER]: mongoose.Types.ObjectId()
                }
            };
            const res = mockResponse();
            const expectedRes = {
                ...RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR,
                message: errorMessage
            };

            // Mock
            const findLikeSpy = jest
                .spyOn(Like, "find")
                .mockRejectedValue(new Error(errorMessage));

            // Test
            const response = await likeController.getLikes(req, res);
            expect(findLikeSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });
    });

    describe("getLikeById", () => {
        test("Returns 200 and like data successful query", async () => {
            // Var
            const req = {params: {[LIKE_ID]: mongoose.Types.ObjectId()}};
            const res = mockResponse();
            const expectedData = { key: "val" };
            const expectedRes = {
                ...RESPONSE_CODES.SUCCESS.OK,
                data: expectedData
            };

            // Mock
            const findLikeSpy = jest
                .spyOn(Like, "findById")
                .mockResolvedValue(expectedData);

            // Test
            const response = await likeController.getLikeById(req, res);
            expect(findLikeSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });

        test("Returns 404 if like does not exist", async () => {
            // Var
            const req = {params: {[LIKE_ID]: mongoose.Types.ObjectId()}};
            const res = mockResponse();
            const expectedRes = RESPONSE_CODES.CLIENT_ERROR.NOT_FOUND;

            // Mock
            const findLikeSpy = jest
                .spyOn(Like, "findById")
                .mockResolvedValue(null);

            // Test
            const response = await likeController.getLikeById(req, res);
            expect(findLikeSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });

        test("Returns 500 if exception occurs", async () => {
            // Var
            const errorMessage = "Error message";
            const req = {params: {[LIKE_ID]: mongoose.Types.ObjectId()}};
            const res = mockResponse();
            const expectedRes = {
                ...RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR,
                message: errorMessage
            };

            // Mock
            const findLikeSpy = jest
                .spyOn(Like, "findById")
                .mockRejectedValue(new Error(errorMessage));

            // Test
            const response = await likeController.getLikeById(req, res);
            expect(findLikeSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });
    });

    describe("deleteLikeById", () => {
        test("Returns 204 on successful delete", async () => {
            // Var
            const req = {params: {[LIKE_ID]: mongoose.Types.ObjectId()}};
            const res = mockResponse();
            const expectedRes = RESPONSE_CODES.SUCCESS.NO_CONTENT;

            // Mock
            const findLikeSpy = jest
                .spyOn(Like, "findByIdAndDelete")
                .mockResolvedValue({ doc: "doc" });

            // Test
            const response = await likeController.deleteLikeById(req, res);
            expect(findLikeSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });

        test("Returns 404 if like does not exist", async () => {
            // Var
            const req = {params: {[LIKE_ID]: mongoose.Types.ObjectId()}};
            const res = mockResponse();
            const expectedRes = RESPONSE_CODES.CLIENT_ERROR.NOT_FOUND;

            // Mock
            const findLikeSpy = jest
                .spyOn(Like, "findByIdAndDelete")
                .mockResolvedValue(null);

            // Test
            const response = await likeController.deleteLikeById(req, res);
            expect(findLikeSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });

        test("Returns 500 if exception occurs", async () => {
            // Var
            const errorMessage = "Error message";
            const req = {
                params: {
                    [LIKE_ID]: mongoose.Types.ObjectId(),
                }
            };
            const res = mockResponse();
            const expectedRes = {
                ...RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR,
                message: errorMessage
            };

            // Mock
            const findLikeSpy = jest
                .spyOn(Like, "findByIdAndDelete")
                .mockRejectedValue(new Error(errorMessage));

            // Test
            const response = await likeController.deleteLikeById(req, res);
            expect(findLikeSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });
    });
});