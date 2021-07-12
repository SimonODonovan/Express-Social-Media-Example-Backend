import express from "express";
import { POST_ID, POST_MODEL_NAME, POST_MODEL_FIELDS } from "../constants/postConstants.js";
import * as postController from "../controllers/postController.js";
import hasRouteParamsAll from "../middleware/hasRouteParamsAll.js";
import hasBodyParamsSome from "../middleware/hasBodyParamsSome.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isValidObjectId from "../middleware/isValidObjectId.js";
import objectIdExists from "../middleware/objectIdExists.js";

const ROUTES = {
    BASE: "/",
    WITH_POST_ID: `/:${POST_ID}`
};

// Define Post route middleware params.
const mw = {
    hasPostIdParam: (req, res, next) => hasRouteParamsAll(req, res, next, [POST_ID]),
    hasPostContent: (req, res, next) => hasBodyParamsSome(req, res, next, [POST_MODEL_FIELDS.MESSAGE, POST_MODEL_FIELDS.FILES, POST_MODEL_FIELDS.LINK]),
    isValidPostId: (req, res, next) => isValidObjectId(req, res, next, req.params[POST_ID]),
    postExists: (req, res, next) => objectIdExists(req, res, next, req.params[POST_ID], POST_MODEL_NAME)
};

const postsRouter = express.Router();

postsRouter
    .use(ROUTES.BASE, isAuthenticated)
    .use(ROUTES.WITH_POST_ID, mw.hasPostIdParam, mw.isValidPostId, mw.postExists);

postsRouter
    .route(ROUTES.BASE)
    .post(mw.hasPostContent, postController.createPost);

postsRouter
    .route(ROUTES.WITH_POST_ID)
    .get(postController.getPostById)
    .delete(isAuthenticated, postController.deletePostById);

export default postsRouter;
export { ROUTES };