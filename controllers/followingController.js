import Following from "../models/followingModel.js";
import RESPONSE_CODES from "../constants/responseCodes.js";
import { FOLLOWING_ID, SUCCESS_MESSAGES, FOLLOWING_MODEL_FIELDS } from "../constants/followingConstants.js";

/**
 * Create a new following association between following and follower.
 * @param {Object} req  - Express request object.
 * @param {Object} res  - Express request object.
 * @returns {Promise}   - Express response object.
 */
const createFollowing = async (req, res) => {
    try {
        const documentContent = {
            [FOLLOWING_MODEL_FIELDS.FOLLOWER]: req.body[FOLLOWING_MODEL_FIELDS.FOLLOWER],
            [FOLLOWING_MODEL_FIELDS.FOLLOWING]: req.body[FOLLOWING_MODEL_FIELDS.FOLLOWING]
        };

        await Following.create(documentContent);
        const response = RESPONSE_CODES.SUCCESS.CREATED;
        return res.status(response.code).json({
            ...response,
            message: SUCCESS_MESSAGES.CREATED_FOLLOWING
        });
    } catch (err) {
        const response = RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR;
        return res.status(response.code).json({
            ...response,
            message: err.message
        });
    }
};

/**
 * Get one or more followings based on follower and following ID filters.
 * @param {Object} req  - Express request object. 
 * @param {Object} res  - Express request object. 
 * @returns {Promise}   - Express response object. 
 */
const getFollowings = async (req, res) => {
    const followerFilter = req.body[FOLLOWING_MODEL_FIELDS.FOLLOWER];
    const followingFilter = req.body[FOLLOWING_MODEL_FIELDS.FOLLOWING];
    const queryFilter = {};

    if (followerFilter)
        queryFilter[FOLLOWING_MODEL_FIELDS.FOLLOWER] = followerFilter;

    if (followingFilter)
        queryFilter[FOLLOWING_MODEL_FIELDS.FOLLOWING] = followingFilter;

    try {
        const followings = await Following.find(queryFilter);
        let response;
        if (followings.length > 0) {
            response = { ...RESPONSE_CODES.SUCCESS.OK, data: followings };
        } else {
            response = RESPONSE_CODES.CLIENT_ERROR.NOT_FOUND;
        }
        return res.status(response.code).json(response);
    } catch (err) {
        const response = RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR;
        return res.status(response.code).json({
            ...response,
            message: err.message
        });
    }
};

/**
 * Get a single following by its mongoose Object Id.
 * @param {Object} req  - Express request object. 
 * @param {Object} res  - Express request object. 
 * @returns {Promise}   - Express response object. 
 */
const getFollowingById = async (req, res) => {
    try {
        const followingId = req.params[FOLLOWING_ID];
        const following = await Following.findById(followingId);
        let response;
        if (following) {
            response = { ...RESPONSE_CODES.SUCCESS.OK, data: following };
        } else {
            response = RESPONSE_CODES.CLIENT_ERROR.NOT_FOUND;
        }
        return res.status(response.code).json(response);
    } catch (err) {
        const response = RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR;
        return res.status(response.code).json({
            ...response,
            message: err.message
        });
    }
};

/**
 * Find and delete a single following by its mongoose Object Id.
 * @param {Object} req  - Express request object. 
 * @param {Object} res  - Express request object. 
 * @returns {Promise}   - Express response object. 
 */
const deleteFollowingById = async (req, res) => {
    try {
        const followingId = req.params[FOLLOWING_ID];
        const doc = await Following.findByIdAndDelete(followingId);
        let response;
        if (doc) {
            response = RESPONSE_CODES.SUCCESS.NO_CONTENT;
        } else {
            response = RESPONSE_CODES.CLIENT_ERROR.NOT_FOUND;
        }
        return res.status(response.code).json(response);
    } catch (err) {
        const response = RESPONSE_CODES.SERVER_ERROR.INTERNAL_ERROR;
        return res.status(response.code).json({
            ...response,
            message: err.message
        });
    }
};

export { createFollowing, getFollowings, getFollowingById, deleteFollowingById };