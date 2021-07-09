import express from "express";
import { LIKE_ID, LIKE_MODEL_NAME } from "../constants/likeConstants.js";
import { POST_ID } from "../constants/postConstants.js";
import { USER_ID } from "../constants/userConstants.js";
import hasRouteParamsAll from "../middleware/hasRouteParamsAll.js";
import hasBodyParamsAll from "../middleware/hasBodyParamsAll.js";
import hasBodyParamsSome from "../middleware/hasBodyParamsSome.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isValidObjectId from "../middleware/isValidObjectId.js";
import objectIdExists from "../middleware/objectIdExists.js";
import hasNoMatchingDocument from "../middleware/hasNoMatchingDocument.js";
import * as likeController from "../controllers/likeController.js";

const ROUTES = {
    BASE: "/",
    WITH_LIKE_ID: `/:${LIKE_ID}`,
};

// Define Link route middleware params.
const hasNoMatchingDocumentFilter = (req) => ({[POST_ID]: req.body[POST_ID], [USER_ID]: req.body[USER_ID]});
const mw = {
    hasLikeIdRouteParam: (req, res, next) => hasRouteParamsAll(req, res, next, [LIKE_ID]),
    hasRequiredBodyParams: (req, res, next) => hasBodyParamsAll(req, res, next, [POST_ID, USER_ID]),
    hasLikesFilter: (req, res, next) => hasBodyParamsSome(req, res, next, [POST_ID, USER_ID]),
    isValidLikeId: (req, res, next) => isValidObjectId(req, res, next, req.params[LIKE_ID]),
    likeExists: (req, res, next) => objectIdExists(req, res, next, req.params[LIKE_ID], LIKE_MODEL_NAME),
    likeDoesntExist: (req, res, next) => hasNoMatchingDocument(req, res, next, LIKE_MODEL_NAME, hasNoMatchingDocumentFilter(req))
};

const likeRouter = express.Router();

likeRouter
    .use(isAuthenticated)
    .use(ROUTES.WITH_LIKE_ID, mw.hasLikeIdRouteParam, mw.isValidLikeId, mw.likeExists);

likeRouter
    .route(ROUTES.BASE)
    .get(mw.hasLikesFilter, likeController.getLikes)
    .post(mw.hasRequiredBodyParams, mw.likeDoesntExist, likeController.createLike);

likeRouter
    .route(ROUTES.WITH_LIKE_ID)
    .get(likeController.getLikeById)
    .delete(likeController.deleteLikeById);

export default likeRouter;
export { ROUTES };