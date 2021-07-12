import { describe, test, expect } from "@jest/globals";
import * as postModelValidators from "../../../../../models/validators/postModelValidators.js";
import { FILES, LINKS, MESSAGES, TAGS, TIMESTAMPS } from "../../../testConstants/postConstants.js";
import { POST_MODEL_FIELDS } from "../../../../../constants/postConstants.js";

describe("Post Model Validators", () => {
    describe("postNotEmpty", () => {
        test("returns true if model has a message", () => {
            // Var
            const model = { [POST_MODEL_FIELDS.MESSAGE]: MESSAGES.VALID_MESSAGE };

            // Test
            const res = postModelValidators.postNotEmpty(model);
            expect(res).toBeTruthy();
        });

        test("returns true if model has files", () => {
            // Var
            const model = { [POST_MODEL_FIELDS.FILES]: FILES.VALID_FILES };

            // Test
            const res = postModelValidators.postNotEmpty(model);
            expect(res).toBeTruthy();
        });

        test("returns true if model has a link", () => {
            // Var
            const model = { [POST_MODEL_FIELDS.LINK]: LINKS.VALID_LINK };

            // Test
            const res = postModelValidators.postNotEmpty(model);
            expect(res).toBeTruthy();
        });

        test("returns false if model does not have message, files or link", () => {
            // Var
            const model = { key: "val" };

            // Test
            const res = postModelValidators.postNotEmpty(model);
            expect(res).toBeFalsy();
        });
    });

    describe("isUtcTimestamp", () => {
        test("returns true if value matches UTC timestamp string", () => {
            // Var
            const timestamp = TIMESTAMPS.VALID_TIMESTAMP;

            // Test
            const res = postModelValidators.isUtcTimestamp(timestamp);
            expect(res).toBeTruthy();
        });

        test("returns false if string value does not match UTC timestamp string", () => {
            // Var
            const timestamp = TIMESTAMPS.INVALID_TIMESTAMP_FORMAT;

            // Test
            const res = postModelValidators.isUtcTimestamp(timestamp);
            expect(res).toBeFalsy();
        });

        test("returns false if value is not a string", () => {
            // Var
            const timestamp = TIMESTAMPS.INVALID_TIMESTAMP_IS_NUMBER;

            // Test
            const res = postModelValidators.isUtcTimestamp(timestamp);
            expect(res).toBeFalsy();
        });

        test("returns false if value is not a string", () => {
            // Var
            const timestamp = TIMESTAMPS.INVALID_TIMESTAMP_IS_NUMBER;

            // Test
            const res = postModelValidators.isUtcTimestamp(timestamp);
            expect(res).toBeFalsy();
        });
    });

    describe("timeStampHasValidContent", () => {
        test("returns true with valid UTC timestamp", () => {
            // Var
            const timestamp = TIMESTAMPS.VALID_TIMESTAMP;

            // Test
            const res = postModelValidators.timeStampHasValidContent(timestamp);
            expect(res).toBeTruthy();
        });

        test("returns false if timestamp contains invalid content", () => {
            // Var
            const timestamp = { [POST_MODEL_FIELDS.MESSAGE]: MESSAGES.INVALID_TIMESTAMP_CONTENT };

            // Test
            const res = postModelValidators.postNotEmpty(timestamp);
            expect(res).toBeFalsy();
        });

        test("returns false if value is not a timestamp string", () => {
            // Var
            const timestamp = { [POST_MODEL_FIELDS.MESSAGE]: MESSAGES.INVALID_TIMESTAMP_FORMAT };

            // Test
            const res = postModelValidators.postNotEmpty(timestamp);
            expect(res).toBeFalsy();
        });

        test("returns false if value is not a string", () => {
            // Var
            const timestamp = { [POST_MODEL_FIELDS.MESSAGE]: MESSAGES.INVALID_TIMESTAMP_IS_NUMBER };

            // Test
            const res = postModelValidators.postNotEmpty(timestamp);
            expect(res).toBeFalsy();
        });
    });

    describe("arrayContentAreUrls", () => {
        test("returns true with valid URLs", () => {
            // Var
            const urls = [LINKS.VALID_LINK, LINKS.VALID_LINK];

            // Test
            const res = postModelValidators.arrayContentAreUrls(urls);
            expect(res).toBeTruthy();
        });

        test("returns false with invalid URL strings", () => {
            // Var
            const urls = [LINKS.INVALID_LINK_NO_TOP_DOMAIN];

            // Test
            const res = postModelValidators.arrayContentAreUrls(urls);
            expect(res).toBeFalsy();
        });

        test("returns false with non-string value", () => {
            // Var
            const urls = [LINKS.INVALID_LINK_IS_NUMBER];

            // Test
            const res = postModelValidators.arrayContentAreUrls(urls);
            expect(res).toBeFalsy();
        });
    });

    describe("areValidTags", () => {
        test("returns true with valid tags", () => {
            // Var
            const tags = TAGS.VALID_TAGS;

            // Test
            const res = postModelValidators.areValidTags(tags);
            expect(res).toBeTruthy();
        });

        test("returns false with invalid tag strings", () => {
            // Var
            const tags = TAGS.INVALID_TAGS_FORMAT;

            // Test
            const res = postModelValidators.areValidTags(tags);
            expect(res).toBeFalsy();
        });

        test("returns false with non-string value", () => {
            // Var
            const tags = TAGS.INVALID_TAGS_IS_NUMBER;

            // Test
            const res = postModelValidators.areValidTags(tags);
            expect(res).toBeFalsy();
        });
    });
});