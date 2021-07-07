import { POST_TAG_REGEX, POST_TIMESTAMP_REGEX } from "../../constants/postConstants.js";
import isURL from "validator/lib/isURL.js";
import isString from "../../helpers/isString.js";

/**
 * Mongoose validator, check if a new Post has content.
 * @param {Object} model    - Mongoose model reference.
 * @returns {Boolean}       - Boolean post is not empty.
 */
const postNotEmpty = (model) => {
    return (
        Boolean(model.message) ||
        Boolean(model.files) ||
        Boolean(model.link)
    );
};

/**
 * Does value match a UTC timestamp format.
 * @param {String} value    - The value to test.
 * @returns {Boolean}       - Boolean value matches UTC timestamp.
 */
const isUtcTimestamp = (value) => {
    const isUtcTimestampString = new RegExp(POST_TIMESTAMP_REGEX).test(value);
    return isUtcTimestampString;
};

/**
 * Does value String contain valid date content.
 * Call isUtcTimestamp beforehand to validate isString.
 * @param {String} value    - The value to test.
 * @returns {Boolean}       - Boolean value is valid date String.
 */
const timeStampHasValidContent = (value) => {
    const date = new Date(value);
    const isValidDate = date instanceof Date && !isNaN(date.getTime());
    return isValidDate;
};

/**
 * Check each element of array is a valid URL.
 * @param {[String]} values - The array to test.
 * @returns {Boolean}       - Boolean all array values are URLs.
 */
const arrayContentAreUrls = (values) => {
    for (const value of values) {
        if (!isString(value) || !isURL(value))
            return false;
    }
    return true;
};

/**
 * Check each element of array is a valid Tag.
 * @param {[String]} values - The array to test.
 * @returns {Boolean}       - Boolean Array values are valid Tags.
 */
const areValidTags = (values) => {
    const regex = new RegExp(POST_TAG_REGEX);
    for (const value of values) {
        if (!regex.test(value))
            return false;
    }
    return true;
};

export { 
    postNotEmpty, 
    isUtcTimestamp, 
    timeStampHasValidContent, 
    arrayContentAreUrls,
    areValidTags
};