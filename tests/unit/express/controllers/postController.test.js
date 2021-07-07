import { afterEach, describe, test, expect, jest } from "@jest/globals";
import Post from "../../../../models/postModel.js";
import RESPONSE_CODES from "../../../../constants/responseCodes.js";
import mongoose from "mongoose";
import { FILES, LINKS, MESSAGES, TAGS } from "../../testConstants/postConstants.js";
import { SUCCESS_MESSAGES } from "../../../../constants/postConstants.js";
import * as postController from "../../../../controllers/postController.js";
import { mockResponse } from "../../testConstants/generalConstants.js";

afterEach(() => jest.restoreAllMocks());

describe("Post Controller", () => {

    describe("createPost", () => {
        test("Returns 201 after creating post successfully with message", async () => {
            // Var
            const req = {
                user: { id: mongoose.Types.ObjectId() },
                body: {
                    message: MESSAGES.VALID_MESSAGE,
                    files: FILES.VALID_FILES,
                    link: LINKS.VALID_LINK,
                    repost:  mongoose.Types.ObjectId(),
                    replyTo:  mongoose.Types.ObjectId(),
                    mentions:  mongoose.Types.ObjectId(),
                    tags: TAGS.VALID_TAGS,
                }
            };
            const res = mockResponse();
            const expectedRes = {
                ...RESPONSE_CODES.SUCCESS.CREATED,
                message: SUCCESS_MESSAGES.CREATED_POST
            };

            // Mock
            const createPostSpy = jest.spyOn(Post, "create").mockImplementation();

            // Test
            const response = await postController.createPost(req, res);
            expect(createPostSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });

        test("Returns 201 after creating post successfully with files", async () => {
            // Var
            const req = {
                user: { id: mongoose.Types.ObjectId() },
                body: {
                    files: FILES.VALID_FILES,
                }
            };
            const res = mockResponse();
            const expectedRes = {
                ...RESPONSE_CODES.SUCCESS.CREATED,
                message: SUCCESS_MESSAGES.CREATED_POST
            };

            // Mock
            const createPostSpy = jest.spyOn(Post, "create").mockImplementation();

            // Test
            const response = await postController.createPost(req, res);
            expect(createPostSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });

        test("Returns 500 if exception occurs", async () => {
            // Var
            const req = {
                user: { id: mongoose.Types.ObjectId() },
                body: {
                    message: MESSAGES.VALID_MESSAGE
                }
            };
            const res = mockResponse();
            const errorMessage = "Error message";
            const expectedRes = {
                ...RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR,
                message: errorMessage
            };

            // Mock
            const createPostSpy = jest
                .spyOn(Post, "create")
                .mockRejectedValue(new Error(errorMessage));

            // Test
            const response = await postController.createPost(req, res);
            expect(createPostSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });
    });

    describe("getPostById", () => {
        test("Returns 200 and post data", async () => {
            // Var
            const req = {params: {postId: mongoose.Types.ObjectId()}};
            const res = mockResponse();
            const postData = "Post data";
            const expectedRes = {
                ...RESPONSE_CODES.SUCCESS.OK,
                data: postData
            };

            // Mock
            const findByIdSpy = jest.spyOn(Post, "findById")
                .mockImplementation()
                .mockResolvedValue(postData);

            // Test
            const response = await postController.getPostById(req, res);
            expect(findByIdSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });

        test("Returns 404 if a post is not found", async () => {
            // Var
            const req = {params: {postId: mongoose.Types.ObjectId()}};
            const res = mockResponse();
            const expectedRes = RESPONSE_CODES.CLIENT_ERROR.NOT_FOUND;

            // Mock
            const findByIdSpy = jest.spyOn(Post, "findById")
                .mockImplementation()
                .mockResolvedValue(null);

            // Test
            const response = await postController.getPostById(req, res);
            expect(findByIdSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });

        test("Returns 500 if an exception occurs", async () => {
            // Var
            const req = {params: {postId: mongoose.Types.ObjectId()}};
            const res = mockResponse();
            const errorMessage = "Error message";
            const expectedRes = {
                ...RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR, 
                message: errorMessage
            };

            // Mock
            const findByIdSpy = jest.spyOn(Post, "findById")
                .mockRejectedValue(new Error(errorMessage));

            // Test
            const response = await postController.getPostById(req, res);
            expect(findByIdSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });
    });

    describe("deletePostById", () => {
        test("Returns 204 on successful post delete", async () => {
            // Var
            const req = {params: {postId: mongoose.Types.ObjectId()}};
            const res = mockResponse();
            const expectedRes = RESPONSE_CODES.SUCCESS.NO_CONTENT;

            // Mock
            const findByIdAndDeleteSpy = jest.spyOn(Post, "findByIdAndDelete")
                .mockImplementation()
                .mockResolvedValue(true);

            // Test
            const response = await postController.deletePostById(req, res);
            expect(findByIdAndDeleteSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });

        test("Returns 404 if post is not found", async () => {
            // Var
            const req = {params: {postId: mongoose.Types.ObjectId()}};
            const res = mockResponse();
            const expectedRes = RESPONSE_CODES.CLIENT_ERROR.NOT_FOUND;

            // Mock
            const findByIdAndDeleteSpy = jest.spyOn(Post, "findByIdAndDelete")
                .mockImplementation()
                .mockResolvedValue(false);

            // Test
            const response = await postController.deletePostById(req, res);
            expect(findByIdAndDeleteSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });

        test("Returns 500 if an exception occurs", async () => {
            // Var
            const req = {params: {postId: mongoose.Types.ObjectId()}};
            const res = mockResponse();
            const errorMessage = "Error message";
            const expectedRes = {
                ...RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR,
                message: errorMessage
            };

            // Mock
            const findByIdAndDeleteSpy = jest.spyOn(Post, "findByIdAndDelete")
                .mockRejectedValue(new Error(errorMessage));

            // Test
            const response = await postController.deletePostById(req, res);
            expect(findByIdAndDeleteSpy).toHaveBeenCalledTimes(1);
            expect(response.status).toEqual(expectedRes.code);
            expect(response.body).toEqual(expectedRes);
        });
    });
});