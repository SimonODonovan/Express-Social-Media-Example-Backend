import { beforeAll, afterEach, afterAll, describe, test, expect } from "@jest/globals";
import { connectToMongoMemoryServer, closeMemoryServerDatabase, clearMemoryServerDatabase } from "../server/memoryServer.js";
import User from "../../../../models/userModel.js";
import Post from "../../../../models/postModel.js";
import Like from "../../../../models/likeModel.js";
import { TIMESTAMPS, MESSAGES } from "../../testConstants/postConstants.js";
import { EMAILS, PASSWORDS, USERNAMES, HANDLES } from "../../testConstants/userConstants.js";
import { POST_MODEL_FIELDS } from "../../../../constants/postConstants.js";
import { VALIDATION_MESSAGES, LIKE_MODEL_FIELDS } from "../../../../constants/likeConstants.js";
import { USER_MODEL_FIELDS } from "../../../../constants/userConstants.js";

beforeAll(() => setup());
afterEach(() => cleanupPostCollection());
afterAll(() => teardown());

let testUserId;
let testPostId;

/**
 * Setup test environment before any tests run.
 */
const setup = async () => {
    await connectToMongoMemoryServer();
    const testUser = await User.create({
        [USER_MODEL_FIELDS.EMAIL]: EMAILS.VALID_EMAIL,
        [USER_MODEL_FIELDS.PASSWORD]: PASSWORDS.VALID_PASSWORD,
        [USER_MODEL_FIELDS.USERNAME]: USERNAMES.VALID_USERNAME_ALPHANUM,
        [USER_MODEL_FIELDS.HANDLE]: HANDLES.VALID_HANDLE
    });
    testUserId = testUser._id;

    const testPost = await Post.create({
        [POST_MODEL_FIELDS.USER]: testUserId,
        [POST_MODEL_FIELDS.MESSAGE]: MESSAGES.VALID_MESSAGE,
        [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.VALID_TIMESTAMP
    });
    testPostId = testPost._id;
};

/**
 * If Post documents were created during a test, drop them.
 */
const cleanupPostCollection = async () => {
    const documentCount = await Like.collection.count();
    if (documentCount > 0)
        await Like.collection.drop();
};

/**
 * Clean test environment after all tests have executed.
 */
const teardown = async () => {
    await clearMemoryServerDatabase();
    await closeMemoryServerDatabase();
};

describe("Like Model", () => {
    test("Create new like", async () => {
        // Var
        const validLike = {
            [LIKE_MODEL_FIELDS.USER]: testUserId,
            [LIKE_MODEL_FIELDS.POST]: testPostId,
        };

        // Test
        await Like.create(validLike);
        const allLikes = await Like.find().populate(LIKE_MODEL_FIELDS.USER).populate(LIKE_MODEL_FIELDS.POST);
        expect(allLikes.length).toEqual(1);
        const foundLike = allLikes[0];
        expect(foundLike[LIKE_MODEL_FIELDS.USER]._id).toEqual(testUserId);
        expect(foundLike[LIKE_MODEL_FIELDS.USER].email).toEqual(EMAILS.VALID_EMAIL);
        expect(foundLike[LIKE_MODEL_FIELDS.POST]._id).toEqual(testPostId);
        expect(foundLike[LIKE_MODEL_FIELDS.POST][POST_MODEL_FIELDS.MESSAGE]).toEqual(MESSAGES.VALID_MESSAGE);
    });

    test("Fails with post that does not exist", async () => {
        // Var
        const unsavedPost = new Post();
        const invalidLike = {
            [LIKE_MODEL_FIELDS.USER]: testUserId,
            [LIKE_MODEL_FIELDS.POST]: unsavedPost._id,
        };

        // Test
        await expect(Like.create(invalidLike)).rejects.toThrowError(VALIDATION_MESSAGES.POST_NOT_EXIST);
        const allLikes = await Like.find({});
        expect(allLikes.length).toEqual(0);
    });

    test("Fails to create if user id does not exist", async () => {
        // Var
        const unsavedUser = new User();
        const invalidLike = {
            [LIKE_MODEL_FIELDS.USER]: unsavedUser._id,
            [LIKE_MODEL_FIELDS.POST]: testPostId
        };

        // Test
        await expect(Like.create(invalidLike)).rejects.toThrowError(VALIDATION_MESSAGES.USER_NOT_EXIST);
        const allLikes = await Like.find({});
        expect(allLikes.length).toEqual(0);
    });

    test("Fails to create if post id is empty", async () => {
        // Var
        const invalidLike = {
            [LIKE_MODEL_FIELDS.USER]: testUserId,
        };

        // Test
        await expect(Like.create(invalidLike)).rejects.toThrowError(VALIDATION_MESSAGES.POST_REQUIRED);
        const allLikes = await Like.find({});
        expect(allLikes.length).toEqual(0);
    });

    test("Fails to create if user id is empty", async () => {
        // Var
        const invalidLike = {
            [LIKE_MODEL_FIELDS.POST]: testPostId
        };

        // Test
        await expect(Like.create(invalidLike)).rejects.toThrowError(VALIDATION_MESSAGES.USER_REQUIRED);
        const allLikes = await Like.find({});
        expect(allLikes.length).toEqual(0);
    });
});