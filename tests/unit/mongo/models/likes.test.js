import { beforeAll, afterEach, afterAll, describe, test, expect, jest } from "@jest/globals";
import { connectToMongoMemoryServer, closeMemoryServerDatabase, clearMemoryServerDatabase } from "../server/memoryServer.js";
import User from "../../../../models/userModel.js";
import Post from "../../../../models/postModel.js";
import Like from "../../../../models/likeModel.js";
import { TIMESTAMPS, MESSAGES } from "../../testConstants/postConstants.js";
import { EMAILS, PASSWORDS, USERNAMES, HANDLES } from "../../testConstants/userConstants.js";
import { POST_CONTENT_FIELDS, POST_ID } from "../../../../constants/postConstants.js";
import { VALIDATION_MESSAGES } from "../../../../constants/likeConstants.js";
import { USER_ID } from "../../../../constants/userConstants.js";

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
        email: EMAILS.VALID_EMAIL,
        password: PASSWORDS.VALID_PASSWORD,
        username: USERNAMES.VALID_USERNAME_ALPHANUM,
        handle: HANDLES.VALID_HANDLE
    });
    testUserId = testUser._id;

    const testPost = await Post.create({
        user: testUserId,
        [POST_CONTENT_FIELDS.messageContent]: MESSAGES.VALID_MESSAGE,
        timestamp: TIMESTAMPS.VALID_TIMESTAMP
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

jest.setTimeout(1000000);

describe("Like Model", () => {
    test("Create new like", async () => {
        // Var
        const validLike = {
            [USER_ID]: testUserId,
            [POST_ID]: testPostId,
        };

        // Test
        await Like.create(validLike);
        const allLikes = await Like.find().populate(USER_ID).populate(POST_ID);
        expect(allLikes.length).toEqual(1);
        const foundLike = allLikes[0];
        expect(foundLike[USER_ID]._id).toEqual(testUserId);
        expect(foundLike[USER_ID].email).toEqual(EMAILS.VALID_EMAIL);
        expect(foundLike[POST_ID]._id).toEqual(testPostId);
        expect(foundLike[POST_ID][POST_CONTENT_FIELDS.messageContent]).toEqual(MESSAGES.VALID_MESSAGE);
    });

    test("Fails with post that does not exist", async () => {
        // Var
        const unsavedPost = new Post();
        const invalidLike = {
            [USER_ID]: testUserId,
            [POST_ID]: unsavedPost._id,
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
            [USER_ID]: unsavedUser._id,
            [POST_ID]: testPostId
        };

        // Test
        await expect(Like.create(invalidLike)).rejects.toThrowError(VALIDATION_MESSAGES.USER_NOT_EXIST);
        const allLikes = await Like.find({});
        expect(allLikes.length).toEqual(0);
    });

    test("Fails to create if post id is empty", async () => {
        // Var
        const invalidLike = {
            [USER_ID]: testUserId,
        };

        // Test
        await expect(Like.create(invalidLike)).rejects.toThrowError(VALIDATION_MESSAGES.POST_REQUIRED);
        const allLikes = await Like.find({});
        expect(allLikes.length).toEqual(0);
    });

    test("Fails to create if user id is empty", async () => {
        // Var
        const invalidLike = {
            [POST_ID]: testPostId
        };

        // Test
        await expect(Like.create(invalidLike)).rejects.toThrowError(VALIDATION_MESSAGES.USER_REQUIRED);
        const allLikes = await Like.find({});
        expect(allLikes.length).toEqual(0);
    });
});