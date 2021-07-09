import Like from "../models/likeModel.js";
import RESPONSE_CODES from "../constants/responseCodes.js";
import { LIKE_ID, SUCCESS_MESSAGES } from "../constants/likeConstants.js";
import { POST_ID } from "../constants/postConstants.js";
import { USER_ID } from "../constants/userConstants.js";

/**
 * Create a new like association between user and post.
 * @param {Object} req  - Express request object.
 * @param {Object} res  - Express request object.
 * @returns {Promise}   - Express response object.
 */
const createLike = async (req, res) => {
    try {
        const documentContent = {
            [POST_ID]: req.body[POST_ID],
            [USER_ID]: req.body[USER_ID]
        };

        // TODO ensure like relationship doesn't already exist

        await Like.create(documentContent);
        const response = RESPONSE_CODES.SUCCESS.CREATED;
        return res.status(response.code).json({
            ...response,
            message: SUCCESS_MESSAGES.CREATED_LIKE
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
 * Get one or more likes based on post and user ID filters.
 * @param {Object} req  - Express request object. 
 * @param {Object} res  - Express request object. 
 * @returns {Promise}   - Express response object. 
 */
const getLikes = async (req, res) => {
    const postId = req.body[POST_ID];
    const userId = req.body[USER_ID];
    const queryFilter = {};

    if (postId)
        queryFilter[POST_ID] = postId;

    if (userId)
        queryFilter[USER_ID] = userId;

    try {
        const likes = await Like.find(queryFilter);
        let response;
        if (likes.length > 0) {
            response = { ...RESPONSE_CODES.SUCCESS.OK, data: likes };
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
 * Get a single like by its mongoose Object Id.
 * @param {Object} req  - Express request object. 
 * @param {Object} res  - Express request object. 
 * @returns {Promise}   - Express response object. 
 */
const getLikeById = async (req, res) => {
    const likeId = req.params[LIKE_ID];
    try {
        const like = await Like.findById(likeId);
        let response;
        if (like) {
            response = { ...RESPONSE_CODES.SUCCESS.OK, data: like };
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
 * Find and delete a single like by its mongoose Object Id.
 * @param {Object} req  - Express request object. 
 * @param {Object} res  - Express request object. 
 * @returns {Promise}   - Express response object. 
 */
const deleteLikeById = async (req, res) => {
    const likeId = req.params[LIKE_ID];
    try {
        const doc = await Like.findByIdAndDelete(likeId);
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

export { createLike, getLikes, getLikeById, deleteLikeById };