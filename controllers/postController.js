import Post from "../models/postModel.js";
import RESPONSE_CODES from "../constants/responseCodes.js";
import { SUCCESS_MESSAGES, POST_MODEL_FIELDS, POST_ID } from "../constants/postConstants.js";

/**
 * Create a new post.
 * @param {Object} req  - Express request object.
 * @param {Object} res  - Express request object.
 * @returns {Promise}   - Express response object.
 */
const createPost = async (req, res) => {
    try {
        const {
            [POST_MODEL_FIELDS.MESSAGE]: message,
            [POST_MODEL_FIELDS.FILES]: files,
            [POST_MODEL_FIELDS.LINK]: link,
            [POST_MODEL_FIELDS.REPOST]: repost,
            [POST_MODEL_FIELDS.REPLY_TO]: replyTo,
            [POST_MODEL_FIELDS.MENTIONS]: mentions,
            [POST_MODEL_FIELDS.TAGS]: tags
        } = req.body;
        const timestamp = new Date().toUTCString();

        // Object.assign skips null params. 
        // Prevents null/undefined values being written to mongoDB.
        const documentContent = Object.assign({},
            { user: req.user.id },
            message === undefined ? null : { message },
            files === undefined ? null : { files },
            link === undefined ? null : { link },
            repost === undefined ? null : { repost },
            replyTo === undefined ? null : { replyTo },
            mentions === undefined ? null : { mentions },
            tags === undefined ? null : { tags },
            { timestamp }
        );

        await Post.create(documentContent);
        const response = RESPONSE_CODES.SUCCESS.CREATED;
        return res.status(response.code).json({
            ...response,
            message: SUCCESS_MESSAGES.CREATED_POST
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
 * Get a single post by its mongoose Object Id.
 * @param {Object} req  - Express request object. 
 * @param {Object} res  - Express request object. 
 * @returns {Promise}   - Express response object. 
 */
const getPostById = async (req, res) => {
    try {
        const postId = req.params[POST_ID];
        const post = await Post.findById(postId);
        let response;
        if (post) {
            response = { ...RESPONSE_CODES.SUCCESS.OK, data: post };
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
 * Find and delete a single post by its mongoose Object Id.
 * @param {Object} req  - Express request object. 
 * @param {Object} res  - Express request object. 
 * @returns {Promise}   - Express response object. 
 */
const deletePostById = async (req, res) => {
    try {
        const postId = req.params[POST_ID];
        const doc = await Post.findByIdAndDelete(postId);
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

export { createPost, getPostById, deletePostById };