import express from "express";
import { POST_ID, POST_MODEL_NAME } from "../constants/postConstants.js";
import * as postController from "../controllers/postController.js";
import hasParams from "../middleware/hasParams.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isValidObjectId from "../middleware/isValidObjectId.js";
import objectIdExists from "../middleware/objectIdExists.js";

const ROUTES = {
    BASE: "/",
    WITH_POST_ID: `/:${POST_ID}`
};

// Define Post route middleware params.
const mw = {
    hasPostIdParam: (req, res, next) => hasParams(req, res, next, [POST_ID]),
    isValidPostId: (req, res, next) => isValidObjectId(req, res, next, req.params[POST_ID]),
    postExists: (req, res, next) => objectIdExists(req, res, next, req.params[POST_ID], POST_MODEL_NAME)
};

const postsRouter = express.Router();

postsRouter
    .use(ROUTES.BASE, isAuthenticated)
    .use(ROUTES.WITH_POST_ID, mw.hasPostIdParam, mw.isValidPostId, mw.postExists);

postsRouter
    .route(ROUTES.BASE)
    .post(postController.createPost);

postsRouter
    .route(ROUTES.WITH_POST_ID)
    .get(postController.getPostById)
    .delete(isAuthenticated, mw.hasPostIdParam, postController.deletePostById);

export default postsRouter;
export { ROUTES };