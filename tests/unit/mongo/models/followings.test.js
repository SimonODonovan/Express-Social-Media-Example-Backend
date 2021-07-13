import { beforeAll, afterEach, afterAll, describe, test, expect } from "@jest/globals";
import { connectToMongoMemoryServer, closeMemoryServerDatabase, clearMemoryServerDatabase } from "../server/memoryServer.js";
import User from "../../../../models/userModel.js";
import Following from "../../../../models/followingModel.js";
import { EMAILS, PASSWORDS, USERNAMES, HANDLES } from "../../testConstants/userConstants.js";
import { USER_MODEL_FIELDS } from "../../../../constants/userConstants.js";
import { FOLLOWING_MODEL_FIELDS, VALIDATION_MESSAGES } from "../../../../constants/followingConstants.js";

beforeAll(() => setup());
afterEach(() => cleanupPostCollection());
afterAll(() => teardown());

let testFollowerUser;
let testFollowingUser;

/**
 * Setup test environment before any tests run.
 */
const setup = async () => {
    await connectToMongoMemoryServer();
    const testUser1 = await User.create({
        [USER_MODEL_FIELDS.EMAIL]: EMAILS.VALID_EMAIL,
        [USER_MODEL_FIELDS.PASSWORD]: PASSWORDS.VALID_PASSWORD,
        [USER_MODEL_FIELDS.USERNAME]: USERNAMES.VALID_USERNAME_ALPHANUM,
        [USER_MODEL_FIELDS.HANDLE]: HANDLES.VALID_HANDLE
    });
    testFollowerUser = testUser1;

    const testUser2 = await User.create({
        [USER_MODEL_FIELDS.EMAIL]: EMAILS.VALID_EMAIL_ALT,
        [USER_MODEL_FIELDS.PASSWORD]: PASSWORDS.VALID_PASSWORD,
        [USER_MODEL_FIELDS.USERNAME]: USERNAMES.VALID_USERNAME_ALPHANUM,
        [USER_MODEL_FIELDS.HANDLE]: HANDLES.VALID_HANDLE_ALT
    });
    testFollowingUser = testUser2;
};

/**
 * If Post documents were created during a test, drop them.
 */
const cleanupPostCollection = async () => {
    const documentCount = await Following.collection.count();
    if (documentCount > 0)
        await Following.collection.drop();
};

/**
 * Clean test environment after all tests have executed.
 */
const teardown = async () => {
    await clearMemoryServerDatabase();
    await closeMemoryServerDatabase();
};

describe("Following Model", () => {
    test("Create new following", async () => {
        // Var
        const validFollowing = {
            [FOLLOWING_MODEL_FIELDS.FOLLOWER]: testFollowerUser._id,
            [FOLLOWING_MODEL_FIELDS.FOLLOWING]: testFollowingUser._id,
        };

        // Test
        await Following.create(validFollowing);
        const allFollowings = await Following
            .find()
            .populate(FOLLOWING_MODEL_FIELDS.FOLLOWER)
            .populate(FOLLOWING_MODEL_FIELDS.FOLLOWING);
        expect(allFollowings.length).toEqual(1);
        const foundFollowing = allFollowings[0];
        expect(foundFollowing[FOLLOWING_MODEL_FIELDS.FOLLOWER]._id).toEqual(testFollowerUser._id);
        expect(foundFollowing[FOLLOWING_MODEL_FIELDS.FOLLOWER][USER_MODEL_FIELDS.EMAIL]).toEqual(EMAILS.VALID_EMAIL);
        expect(foundFollowing[FOLLOWING_MODEL_FIELDS.FOLLOWING]._id).toEqual(testFollowingUser._id);
        expect(foundFollowing[FOLLOWING_MODEL_FIELDS.FOLLOWING][USER_MODEL_FIELDS.EMAIL]).toEqual(EMAILS.VALID_EMAIL_ALT);
    });

    test("Fails with follower that does not exist", async () => {
        // Var
        const unsavedUser = new User();
        const invalidFollowing = {
            [FOLLOWING_MODEL_FIELDS.FOLLOWER]: unsavedUser._id,
            [FOLLOWING_MODEL_FIELDS.FOLLOWING]: testFollowingUser._id,
        };

        // Test
        await expect(Following.create(invalidFollowing)).rejects.toThrowError(VALIDATION_MESSAGES.FOLLOWER_USER_NOT_EXIST);
        const allFollowings = await Following.find({});
        expect(allFollowings.length).toEqual(0);
    });

    test("Fails with following user that does not exist", async () => {
        // Var
        const unsavedUser = new User();
        const invalidFollowing = {
            [FOLLOWING_MODEL_FIELDS.FOLLOWER]: testFollowerUser._id,
            [FOLLOWING_MODEL_FIELDS.FOLLOWING]: unsavedUser._id,
        };

        // Test
        await expect(Following.create(invalidFollowing)).rejects.toThrowError(VALIDATION_MESSAGES.FOLLOWING_USER_NOT_EXIST);
        const allFollowings = await Following.find({});
        expect(allFollowings.length).toEqual(0);
    });

    test("Fails to create if follower user is empty", async () => {
        // Var
        const invalidFollowing = {
            [FOLLOWING_MODEL_FIELDS.FOLLOWING]: testFollowingUser._id,
        };

        // Test
        await expect(Following.create(invalidFollowing)).rejects.toThrowError(VALIDATION_MESSAGES.FOLLOWER_USER_REQUIRED);
        const allFollowings = await Following.find({});
        expect(allFollowings.length).toEqual(0);
    });

    test("Fails to create if following user is empty", async () => {
        // Var
        const invalidFollowing = {
            [FOLLOWING_MODEL_FIELDS.FOLLOWER]: testFollowerUser._id,
        };

        // Test
        await expect(Following.create(invalidFollowing)).rejects.toThrowError(VALIDATION_MESSAGES.FOLLOWING_USER_REQUIRED);
        const allFollowings = await Following.find({});
        expect(allFollowings.length).toEqual(0);
    });
});