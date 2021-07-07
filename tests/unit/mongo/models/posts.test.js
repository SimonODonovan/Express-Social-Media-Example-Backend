import { beforeAll, afterEach, afterAll, describe, test, expect } from "@jest/globals";
import { connectToMongoMemoryServer, closeMemoryServerDatabase, clearMemoryServerDatabase } from "../server/memoryServer.js";
import User from "../../../../models/userModel.js";
import Post from "../../../../models/postModel.js";
import { TIMESTAMPS, MESSAGES, FILES, LINKS, TAGS } from "../../testConstants/postConstants.js";
import { EMAILS, PASSWORDS, USERNAMES, HANDLES } from "../../testConstants/userConstants.js";
import { POST_MODEL_NAME, VALIDATION_MESSAGES } from "../../../../constants/postConstants.js";
import { USER_MODEL_NAME } from "../../../../constants/userConstants.js";

beforeAll(() => setup());
afterEach(() => cleanupPostCollection());
afterAll(() => teardown());

var testUserId;

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
};

/**
 * If Post documents were created during a test, drop them.
 */
const cleanupPostCollection = async () => {
    const documentCount = await Post.collection.count();
    if (documentCount > 0)
        await Post.collection.drop();
};

/**
 * Clean test environment after all tests have executed.
 */
const teardown = async () => {
    await clearMemoryServerDatabase();
    await closeMemoryServerDatabase();
};

describe("Post Model", () => {
    test("Create post with message", async () => {
        // Var
        const validPost = {
            user: testUserId,
            timestamp: TIMESTAMPS.VALID_TIMESTAMP,
            message: MESSAGES.VALID_MESSAGE
        };

        // Test
        await Post.create(validPost);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(1);
        const foundPost = await allPosts[0].populate(USER_MODEL_NAME);
        expect(foundPost.user._id).toEqual(testUserId);
        expect(foundPost.timestamp).toEqual(TIMESTAMPS.VALID_TIMESTAMP);
        expect(foundPost.message).toEqual(MESSAGES.VALID_MESSAGE);
    });

    test("Fails with user that does not exist", async () => {
        // Var
        const unsavedUser = new User();
        const invalidPost = {
            user: unsavedUser._id,
            timestamp: TIMESTAMPS.VALID_TIMESTAMP,
            message: MESSAGES.VALID_MESSAGE
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.USER_NOT_EXIST);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Fails with invalid timestamp type", async () => {
        // Var
        const invalidPost = {
            user: testUserId,
            timestamp: TIMESTAMPS.INVALID_TIMESTAMP_IS_NUMBER,
            message: MESSAGES.VALID_MESSAGE,
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.TIMESTAMP_INVALID_FORMAT);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Fails with invalid timestamp format", async () => {
        // Var
        const invalidPost = {
            user: testUserId,
            timestamp: TIMESTAMPS.INVALID_TIMESTAMP_FORMAT,
            message: MESSAGES.VALID_MESSAGE,
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.TIMESTAMP_INVALID_FORMAT);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Fails with invalid timestamp content", async () => {
        // Var
        const invalidPost = {
            user: testUserId,
            timestamp: TIMESTAMPS.INVALID_TIMESTAMP_CONTENT,
            message: MESSAGES.VALID_MESSAGE,
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.TIMESTAMP_INVALID_CONTENT);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Fails when message is empty", async () => {
        // Var
        const invalidPost = {
            user: testUserId,
            timestamp: TIMESTAMPS.VALID_TIMESTAMP,
            message: MESSAGES.INVALID_MESSAGE_EMPTY,
            link: LINKS.VALID_LINK
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.MESSAGE_TOO_SHORT);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Fails when message is too long", async () => {
        // Var
        const invalidPost = {
            user: testUserId,
            timestamp: TIMESTAMPS.VALID_TIMESTAMP,
            message: MESSAGES.INVALID_MESSAGE_TOO_LONG,
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.MESSAGE_TOO_LONG);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Create post with files", async () => {
        // Var
        const validPost = {
            user: testUserId,
            timestamp: TIMESTAMPS.VALID_TIMESTAMP,
            files: FILES.VALID_FILES
        };

        // Test
        await Post.create(validPost);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(1);
        const foundPost = await allPosts[0].populate(USER_MODEL_NAME);
        expect(foundPost.user._id).toEqual(testUserId);
        expect(foundPost.timestamp).toEqual(TIMESTAMPS.VALID_TIMESTAMP);
        expect([...foundPost.files]).toStrictEqual(FILES.VALID_FILES);
    });

    test("Fails when files not an array", async () => {
        // Var
        const invalidPost = {
            user: testUserId,
            timestamp: TIMESTAMPS.VALID_TIMESTAMP,
            files: FILES.INVALID_FILES_NOT_STRINGS
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.FILES_INVALID_CONTENT);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Fails when files contain invalid URL", async () => {
        // Var
        const invalidPost = {
            user: testUserId,
            timestamp: TIMESTAMPS.VALID_TIMESTAMP,
            files: FILES.INVALID_FILES_NOT_URL
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.FILES_INVALID_CONTENT);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Create post with LINKS", async () => {
        // Var
        const validPost = {
            user: testUserId,
            timestamp: TIMESTAMPS.VALID_TIMESTAMP,
            link: LINKS.VALID_LINK
        };

        // Test
        await Post.create(validPost);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(1);
        const foundPost = await allPosts[0].populate(USER_MODEL_NAME);
        expect(foundPost.user._id).toEqual(testUserId);
        expect(foundPost.timestamp).toEqual(TIMESTAMPS.VALID_TIMESTAMP);
        expect(foundPost.link).toEqual(LINKS.VALID_LINK);
    });

    test("Fails when LINKS contains invalid URL", async () => {
        // Var
        const invalidPost = {
            user: testUserId,
            timestamp: TIMESTAMPS.VALID_TIMESTAMP,
            link: LINKS.INVALID_LINK_NO_TOP_DOMAIN
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.LINKS_INVALID_CONTENT);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Fails when LINKS contains invalid type", async () => {
        // Var
        const invalidPost = {
            user: testUserId,
            timestamp: TIMESTAMPS.VALID_TIMESTAMP,
            link: LINKS.INVALID_LINK_IS_NUMBER
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.LINKS_INVALID_CONTENT);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Create Post with repost", async () => {
        // Var
        const validPost = {
            user: testUserId,
            timestamp: TIMESTAMPS.VALID_TIMESTAMP,
            message: MESSAGES.VALID_MESSAGE,
        };
        const referencePost = await Post.create(validPost);
        const validPostWithRepost = {
            ...validPost,
            repost: referencePost._id
        };

        // Test
        await Post.create(validPostWithRepost);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(2);
        const foundPost = await allPosts[1].populate(POST_MODEL_NAME);
        expect(foundPost.user._id).toEqual(testUserId);
        expect(foundPost.timestamp).toEqual(TIMESTAMPS.VALID_TIMESTAMP);
        expect(foundPost.message).toEqual(MESSAGES.VALID_MESSAGE);
        expect(foundPost.repost._id).toEqual(referencePost._id);
    });

    test("Fails when repost ref does not exist", async () => {
        // Var
        const unsavedPost = new Post();
        const invalidPost = {
            user: testUserId,
            timestamp: TIMESTAMPS.VALID_TIMESTAMP,
            message: MESSAGES.VALID_MESSAGE,
            repost: unsavedPost._id
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.POST_NOT_EXIST);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Create Post with replyTo", async () => {
        // Var
        const validPost = {
            user: testUserId,
            timestamp: TIMESTAMPS.VALID_TIMESTAMP,
            message: MESSAGES.VALID_MESSAGE,
        };
        const referencePost = await Post.create(validPost);
        const validPostWithRepost = {
            ...validPost,
            replyTo: referencePost._id
        };

        // Test
        await Post.create(validPostWithRepost);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(2);
        const foundPost = await allPosts[1].populate(POST_MODEL_NAME);
        expect(foundPost.user._id).toEqual(testUserId);
        expect(foundPost.timestamp).toEqual(TIMESTAMPS.VALID_TIMESTAMP);
        expect(foundPost.message).toEqual(MESSAGES.VALID_MESSAGE);
        expect(foundPost.replyTo._id).toEqual(referencePost._id);
    });

    test("Fails when replyTo ref does not exist", async () => {
        // Var
        const unsavedPost = new Post();
        const invalidPost = {
            user: testUserId,
            timestamp: TIMESTAMPS.VALID_TIMESTAMP,
            message: MESSAGES.VALID_MESSAGE,
            replyTo: unsavedPost._id
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.POST_NOT_EXIST);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Create Post with mentions", async () => {
        // Var
        const validUser = {
            email: EMAILS.VALID_EMAIL_ALT,
            password: PASSWORDS.VALID_PASSWORD,
            username: USERNAMES.VALID_USERNAME_ALPHANUM,
            handle: HANDLES.VALID_HANDLE_ALT
        };
        const altTestUser = await User.create(validUser);
        const validPost = {
            user: testUserId,
            timestamp: TIMESTAMPS.VALID_TIMESTAMP,
            message: MESSAGES.VALID_MESSAGE,
            mentions: [altTestUser._id]
        };

        // Test
        await Post.create(validPost);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(1);
        const foundPost = await allPosts[0].populate(USER_MODEL_NAME);
        expect(foundPost.user._id).toEqual(testUserId);
        expect(foundPost.timestamp).toEqual(TIMESTAMPS.VALID_TIMESTAMP);
        expect(foundPost.message).toEqual(MESSAGES.VALID_MESSAGE);
        expect(foundPost.mentions[0]._id).toEqual(altTestUser._id);
    });

    test("Fails with mentioned user that does not exist", async () => {
        // Var
        const unsavedUser = new User();
        const invalidPost = {
            user: testUserId,
            timestamp: TIMESTAMPS.VALID_TIMESTAMP,
            message: MESSAGES.VALID_MESSAGE,
            mentions: [unsavedUser._id]
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.USER_NOT_EXIST);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Create post with tags", async () => {
        // Var
        const validPost = {
            user: testUserId,
            timestamp: TIMESTAMPS.VALID_TIMESTAMP,
            message: MESSAGES.VALID_MESSAGE,
            tags: TAGS.VALID_TAGS
        };

        // Test
        await Post.create(validPost);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(1);
        const foundPost = await allPosts[0];
        expect(foundPost.user._id).toEqual(testUserId);
        expect(foundPost.timestamp).toEqual(TIMESTAMPS.VALID_TIMESTAMP);
        expect([...foundPost.tags]).toEqual(TAGS.VALID_TAGS);
    });

    test("Fails with invalid tags content", async () => {
        // Var
        const invalidPost = {
            user: testUserId,
            timestamp: TIMESTAMPS.VALID_TIMESTAMP,
            message: MESSAGES.VALID_MESSAGE,
            tags: TAGS.INVALID_TAGS_IS_NUMBER
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.TAG_INVALID_FORMAT);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Fails with invalid tags type", async () => {
        // Var
        const invalidPost = {
            user: testUserId,
            timestamp: TIMESTAMPS.VALID_TIMESTAMP,
            message: MESSAGES.VALID_MESSAGE,
            tags: TAGS.INVALID_TAGS_FORMAT
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.TAG_INVALID_FORMAT);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });
});