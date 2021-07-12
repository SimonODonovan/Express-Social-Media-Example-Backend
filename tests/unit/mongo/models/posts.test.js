import { beforeAll, afterEach, afterAll, describe, test, expect } from "@jest/globals";
import { connectToMongoMemoryServer, closeMemoryServerDatabase, clearMemoryServerDatabase } from "../server/memoryServer.js";
import User from "../../../../models/userModel.js";
import Post from "../../../../models/postModel.js";
import { TIMESTAMPS, MESSAGES, FILES, LINKS, TAGS } from "../../testConstants/postConstants.js";
import { EMAILS, PASSWORDS, USERNAMES, HANDLES } from "../../testConstants/userConstants.js";
import { VALIDATION_MESSAGES, POST_MODEL_FIELDS } from "../../../../constants/postConstants.js";
import { USER_MODEL_NAME, USER_MODEL_FIELDS } from "../../../../constants/userConstants.js";

beforeAll(() => setup());
afterEach(() => cleanupPostCollection());
afterAll(() => teardown());

let testUser;

/**
 * Setup test environment before any tests run.
 */
const setup = async () => {
    await connectToMongoMemoryServer();
    testUser = await User.create({
        [USER_MODEL_FIELDS.EMAIL]: EMAILS.VALID_EMAIL,
        [USER_MODEL_FIELDS.PASSWORD]: PASSWORDS.VALID_PASSWORD,
        [USER_MODEL_FIELDS.USERNAME]: USERNAMES.VALID_USERNAME_ALPHANUM,
        [USER_MODEL_FIELDS.HANDLE]: HANDLES.VALID_HANDLE
    });
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
            [POST_MODEL_FIELDS.USER]: testUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.VALID_TIMESTAMP,
            [POST_MODEL_FIELDS.MESSAGE]:MESSAGES.VALID_MESSAGE
        };

        // Test
        await Post.create(validPost);
        const allPosts = await Post.find({}).populate(USER_MODEL_NAME);
        expect(allPosts.length).toEqual(1);
        const foundPost = allPosts[0];
        expect(foundPost.user._id).toEqual(testUser._id);
        expect(foundPost.timestamp).toEqual(TIMESTAMPS.VALID_TIMESTAMP);
        expect(foundPost.message).toEqual(MESSAGES.VALID_MESSAGE);
        expect(foundPost.user.email).toEqual(testUser.email);
    });

    test("Fails with user that does not exist", async () => {
        // Var
        const unsavedUser = new User();
        const invalidPost = {
            [POST_MODEL_FIELDS.USER]: unsavedUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.VALID_TIMESTAMP,
            [POST_MODEL_FIELDS.MESSAGE]:MESSAGES.VALID_MESSAGE
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.USER_NOT_EXIST);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Fails with invalid timestamp type", async () => {
        // Var
        const invalidPost = {
            [POST_MODEL_FIELDS.USER]: testUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.INVALID_TIMESTAMP_IS_NUMBER,
            [POST_MODEL_FIELDS.MESSAGE]:MESSAGES.VALID_MESSAGE,
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.TIMESTAMP_INVALID_FORMAT);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Fails with invalid timestamp format", async () => {
        // Var
        const invalidPost = {
            [POST_MODEL_FIELDS.USER]: testUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.INVALID_TIMESTAMP_FORMAT,
            [POST_MODEL_FIELDS.MESSAGE]:MESSAGES.VALID_MESSAGE,
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.TIMESTAMP_INVALID_FORMAT);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Fails with invalid timestamp content", async () => {
        // Var
        const invalidPost = {
            [POST_MODEL_FIELDS.USER]: testUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.INVALID_TIMESTAMP_CONTENT,
            [POST_MODEL_FIELDS.MESSAGE]:MESSAGES.VALID_MESSAGE,
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.TIMESTAMP_INVALID_CONTENT);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Fails when message is empty", async () => {
        // Var
        const invalidPost = {
            [POST_MODEL_FIELDS.USER]: testUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.VALID_TIMESTAMP,
            [POST_MODEL_FIELDS.MESSAGE]:MESSAGES.INVALID_MESSAGE_EMPTY,
            [POST_MODEL_FIELDS.LINK]:LINKS.VALID_LINK
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.MESSAGE_TOO_SHORT);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Fails when message is too long", async () => {
        // Var
        const invalidPost = {
            [POST_MODEL_FIELDS.USER]: testUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.VALID_TIMESTAMP,
            [POST_MODEL_FIELDS.MESSAGE]:MESSAGES.INVALID_MESSAGE_TOO_LONG,
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.MESSAGE_TOO_LONG);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Create post with files", async () => {
        // Var
        const validPost = {
            [POST_MODEL_FIELDS.USER]: testUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.VALID_TIMESTAMP,
            [POST_MODEL_FIELDS.FILES]:FILES.VALID_FILES
        };

        // Test
        await Post.create(validPost);
        const allPosts = await Post.find({}).populate(USER_MODEL_NAME);
        expect(allPosts.length).toEqual(1);
        const foundPost = allPosts[0];
        expect(foundPost.user._id).toEqual(testUser._id);
        expect(foundPost.timestamp).toEqual(TIMESTAMPS.VALID_TIMESTAMP);
        expect([...foundPost.files]).toStrictEqual(FILES.VALID_FILES);
        expect(foundPost.user.email).toEqual(testUser.email);
    });

    test("Fails when files not an array", async () => {
        // Var
        const invalidPost = {
            [POST_MODEL_FIELDS.USER]: testUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.VALID_TIMESTAMP,
            [POST_MODEL_FIELDS.FILES]:FILES.INVALID_FILES_NOT_STRINGS
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.FILES_INVALID_CONTENT);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Fails when files contain invalid URL", async () => {
        // Var
        const invalidPost = {
            [POST_MODEL_FIELDS.USER]: testUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.VALID_TIMESTAMP,
            [POST_MODEL_FIELDS.FILES]:FILES.INVALID_FILES_NOT_URL
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.FILES_INVALID_CONTENT);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Create post with links", async () => {
        // Var
        const validPost = {
            [POST_MODEL_FIELDS.USER]: testUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.VALID_TIMESTAMP,
            [POST_MODEL_FIELDS.LINK]:LINKS.VALID_LINK
        };

        // Test
        await Post.create(validPost);
        const allPosts = await Post.find({}).populate(USER_MODEL_NAME);
        expect(allPosts.length).toEqual(1);
        const foundPost = allPosts[0];
        expect(foundPost.user._id).toEqual(testUser._id);
        expect(foundPost.timestamp).toEqual(TIMESTAMPS.VALID_TIMESTAMP);
        expect(foundPost.link).toEqual(LINKS.VALID_LINK);
        expect(foundPost.user.email).toEqual(testUser.email);
    });

    test("Fails when links contains invalid URL", async () => {
        // Var
        const invalidPost = {
            [POST_MODEL_FIELDS.USER]: testUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.VALID_TIMESTAMP,
            [POST_MODEL_FIELDS.LINK]:LINKS.INVALID_LINK_NO_TOP_DOMAIN
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.LINKS_INVALID_CONTENT);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Fails when links contains invalid type", async () => {
        // Var
        const invalidPost = {
            [POST_MODEL_FIELDS.USER]: testUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.VALID_TIMESTAMP,
            [POST_MODEL_FIELDS.LINK]:LINKS.INVALID_LINK_IS_NUMBER
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.LINKS_INVALID_CONTENT);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Create Post with repost", async () => {
        // Var
        const validPost = {
            [POST_MODEL_FIELDS.USER]: testUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.VALID_TIMESTAMP,
            [POST_MODEL_FIELDS.MESSAGE]:MESSAGES.VALID_MESSAGE,
        };
        const referencePost = await Post.create(validPost);
        const validPostWithRepost = {
            ...validPost,
            [POST_MODEL_FIELDS.REPOST]: referencePost._id
        };

        // Test
        await Post.create(validPostWithRepost);
        const allPosts = await Post.find({})
            .populate(POST_MODEL_FIELDS.USER)
            .populate(POST_MODEL_FIELDS.REPOST);
        expect(allPosts.length).toEqual(2);
        const foundPost = allPosts[1];
        expect(foundPost.user._id).toEqual(testUser._id);
        expect(foundPost.timestamp).toEqual(TIMESTAMPS.VALID_TIMESTAMP);
        expect(foundPost.message).toEqual(MESSAGES.VALID_MESSAGE);
        expect(foundPost.repost._id).toEqual(referencePost._id);
        expect(foundPost.user.email).toEqual(testUser.email);
        expect(foundPost.repost.message).toEqual(referencePost.message);
    });

    test("Fails when repost ref does not exist", async () => {
        // Var
        const unsavedPost = new Post();
        const invalidPost = {
            [POST_MODEL_FIELDS.USER]: testUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.VALID_TIMESTAMP,
            [POST_MODEL_FIELDS.MESSAGE]:MESSAGES.VALID_MESSAGE,
            [POST_MODEL_FIELDS.REPOST]: unsavedPost._id
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.POST_NOT_EXIST);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Create Post with replyTo", async () => {
        // Var
        const validPost = {
            [POST_MODEL_FIELDS.USER]: testUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.VALID_TIMESTAMP,
            [POST_MODEL_FIELDS.MESSAGE]:MESSAGES.VALID_MESSAGE,
        };
        const referencePost = await Post.create(validPost);
        const validPostWithRepost = {
            ...validPost,
            [POST_MODEL_FIELDS.REPLY_TO]: referencePost._id
        };

        // Test
        await Post.create(validPostWithRepost);
        const allPosts = await Post.find({})
            .populate(POST_MODEL_FIELDS.USER)
            .populate(POST_MODEL_FIELDS.REPLY_TO);
        expect(allPosts.length).toEqual(2);
        const foundPost = allPosts[1];
        expect(foundPost.user._id).toEqual(testUser._id);
        expect(foundPost.timestamp).toEqual(TIMESTAMPS.VALID_TIMESTAMP);
        expect(foundPost.message).toEqual(MESSAGES.VALID_MESSAGE);
        expect(foundPost.replyTo._id).toEqual(referencePost._id);
        expect(foundPost.user.email).toEqual(testUser.email);
        expect(foundPost.replyTo.message).toEqual(referencePost.message);
    });

    test("Fails when replyTo ref does not exist", async () => {
        // Var
        const unsavedPost = new Post();
        const invalidPost = {
            [POST_MODEL_FIELDS.USER]: testUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.VALID_TIMESTAMP,
            [POST_MODEL_FIELDS.MESSAGE]:MESSAGES.VALID_MESSAGE,
            [POST_MODEL_FIELDS.REPLY_TO]: unsavedPost._id
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.POST_NOT_EXIST);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Create Post with mentions", async () => {
        // Var
        const validUser = {
            [USER_MODEL_FIELDS.EMAIL]: EMAILS.VALID_EMAIL_ALT,
            [USER_MODEL_FIELDS.PASSWORD]: PASSWORDS.VALID_PASSWORD,
            [USER_MODEL_FIELDS.USERNAME]: USERNAMES.VALID_USERNAME_ALPHANUM,
            [USER_MODEL_FIELDS.HANDLE]: HANDLES.VALID_HANDLE_ALT
        };
        const altTestUser = await User.create(validUser);
        const validPost = {
            [POST_MODEL_FIELDS.USER]: testUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.VALID_TIMESTAMP,
            [POST_MODEL_FIELDS.MESSAGE]:MESSAGES.VALID_MESSAGE,
            [POST_MODEL_FIELDS.MENTIONS]: [altTestUser._id]
        };

        // Test
        await Post.create(validPost);
        const allPosts = await Post.find({}).populate(USER_MODEL_NAME);
        expect(allPosts.length).toEqual(1);
        const foundPost = allPosts[0];
        expect(foundPost.user._id).toEqual(testUser._id);
        expect(foundPost.timestamp).toEqual(TIMESTAMPS.VALID_TIMESTAMP);
        expect(foundPost.message).toEqual(MESSAGES.VALID_MESSAGE);
        expect(foundPost.mentions[0]._id).toEqual(altTestUser._id);
        expect(foundPost.user.email).toEqual(testUser.email);
    });

    test("Fails with mentioned user that does not exist", async () => {
        // Var
        const unsavedUser = new User();
        const invalidPost = {
            [POST_MODEL_FIELDS.USER]: testUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.VALID_TIMESTAMP,
            [POST_MODEL_FIELDS.MESSAGE]:MESSAGES.VALID_MESSAGE,
            [POST_MODEL_FIELDS.MENTIONS]: [unsavedUser._id]
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.USER_NOT_EXIST);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Create post with tags", async () => {
        // Var
        const validPost = {
            [POST_MODEL_FIELDS.USER]: testUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.VALID_TIMESTAMP,
            [POST_MODEL_FIELDS.MESSAGE]:MESSAGES.VALID_MESSAGE,
            [POST_MODEL_FIELDS.TAGS]: TAGS.VALID_TAGS
        };

        // Test
        await Post.create(validPost);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(1);
        const foundPost = await allPosts[0];
        expect(foundPost.user._id).toEqual(testUser._id);
        expect(foundPost.timestamp).toEqual(TIMESTAMPS.VALID_TIMESTAMP);
        expect([...foundPost.tags]).toEqual(TAGS.VALID_TAGS);
    });

    test("Fails with invalid tags content", async () => {
        // Var
        const invalidPost = {
            [POST_MODEL_FIELDS.USER]: testUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.VALID_TIMESTAMP,
            [POST_MODEL_FIELDS.MESSAGE]:MESSAGES.VALID_MESSAGE,
            [POST_MODEL_FIELDS.TAGS]: TAGS.INVALID_TAGS_IS_NUMBER
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.TAG_INVALID_FORMAT);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });

    test("Fails with invalid tags type", async () => {
        // Var
        const invalidPost = {
            [POST_MODEL_FIELDS.USER]: testUser._id,
            [POST_MODEL_FIELDS.TIMESTAMP]: TIMESTAMPS.VALID_TIMESTAMP,
            [POST_MODEL_FIELDS.MESSAGE]:MESSAGES.VALID_MESSAGE,
            [POST_MODEL_FIELDS.TAGS]: TAGS.INVALID_TAGS_FORMAT
        };

        // Test
        await expect(Post.create(invalidPost)).rejects.toThrowError(VALIDATION_MESSAGES.TAG_INVALID_FORMAT);
        const allPosts = await Post.find({});
        expect(allPosts.length).toEqual(0);
    });
});