import Post from "../models/postModel.js";
import RESPONSE_CODES from "../constants/responseCodes.js";
import { SUCCESS_MESSAGES } from "../constants/postConstants.js";

/**
 * Create a new post.
 * @param {Object} req  - Express request object.
 * @param {Object} res  - Express request object.
 * @returns {Promise}   - Express response object.
 */
const createPost = async (req, res) => {
    try {
        const { message, files, link, repost, replyTo, mentions, tags } = req.body;
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
    const postId = req.params.postId;
    try {
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
    const postId = req.params.postId;
    try {
        const doc = await Post.findByIdAndDelete(postId);
        let response;
        if(doc) {
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