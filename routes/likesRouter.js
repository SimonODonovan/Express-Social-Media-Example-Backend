import express from "express";
import { LIKE_ID, LIKE_MODEL_NAME, LIKE_MODEL_FIELDS } from "../constants/likeConstants.js";
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

// Define Likes route middleware params.
const hasNoMatchingDocumentFilter = (req) => ({
    [LIKE_MODEL_FIELDS.POST]: req.body[LIKE_MODEL_FIELDS.POST],
    [LIKE_MODEL_FIELDS.USER]: req.body[LIKE_MODEL_FIELDS.USER]
});
const mw = {
    hasLikeIdRouteParam: (req, res, next) => hasRouteParamsAll(req, res, next, [LIKE_ID]),
    hasRequiredBodyParams: (req, res, next) => hasBodyParamsAll(req, res, next, [LIKE_MODEL_FIELDS.POST, LIKE_MODEL_FIELDS.USER]),
    hasLikesFilter: (req, res, next) => hasBodyParamsSome(req, res, next, [LIKE_MODEL_FIELDS.POST, LIKE_MODEL_FIELDS.USER]),
    isValidLikeId: (req, res, next) => isValidObjectId(req, res, next, req.params[LIKE_ID]),
    likeExists: (req, res, next) => objectIdExists(req, res, next, req.params[LIKE_ID], LIKE_MODEL_NAME),
    likeDoesntExist: (req, res, next) => hasNoMatchingDocument(req, res, next, LIKE_MODEL_NAME, hasNoMatchingDocumentFilter(req))
};

const likesRouter = express.Router();

likesRouter
    .use(isAuthenticated)
    .use(ROUTES.WITH_LIKE_ID, mw.hasLikeIdRouteParam, mw.isValidLikeId, mw.likeExists);

likesRouter
    .route(ROUTES.BASE)
    .get(mw.hasLikesFilter, likeController.getLikes)
    .post(mw.hasRequiredBodyParams, mw.likeDoesntExist, likeController.createLike);

likesRouter
    .route(ROUTES.WITH_LIKE_ID)
    .get(likeController.getLikeById)
    .delete(likeController.deleteLikeById);

export default likesRouter;
export { ROUTES };
