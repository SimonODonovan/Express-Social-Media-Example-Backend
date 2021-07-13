import express from "express";
import hasRouteParamsAll from "../middleware/hasRouteParamsAll.js";
import hasBodyParamsAll from "../middleware/hasBodyParamsAll.js";
import hasBodyParamsSome from "../middleware/hasBodyParamsSome.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import isValidObjectId from "../middleware/isValidObjectId.js";
import objectIdExists from "../middleware/objectIdExists.js";
import hasNoMatchingDocument from "../middleware/hasNoMatchingDocument.js";
import { FOLLOWING_ID, FOLLOWING_MODEL_FIELDS, FOLLOWING_MODEL_NAME } from "../constants/followingConstants.js";
import * as followingController from "../controllers/followingController.js";

const ROUTES = {
    BASE: "/",
    WITH_FOLLOWING_ID: `/:${FOLLOWING_ID}`,
};

// Define Link route middleware params.
const hasNoMatchingDocumentFilter = (req) => ({
    [FOLLOWING_MODEL_FIELDS.FOLLOWER]: req.body[FOLLOWING_MODEL_FIELDS.FOLLOWER],
    [FOLLOWING_MODEL_FIELDS.FOLLOWING]: req.body[FOLLOWING_MODEL_FIELDS.FOLLOWING]
});
const mw = {
    hasFollowingIdRouteParam: (req, res, next) => hasRouteParamsAll(req, res, next, [FOLLOWING_ID]),
    hasRequiredBodyParams: (req, res, next) => hasBodyParamsAll(req, res, next, [FOLLOWING_MODEL_FIELDS.FOLLOWER, FOLLOWING_MODEL_FIELDS.FOLLOWING]),
    hasFollowingFilter: (req, res, next) => hasBodyParamsSome(req, res, next, [FOLLOWING_MODEL_FIELDS.FOLLOWER, FOLLOWING_MODEL_FIELDS.FOLLOWING]),
    isValidFollowingId: (req, res, next) => isValidObjectId(req, res, next, req.params[FOLLOWING_ID]),
    followingExists: (req, res, next) => objectIdExists(req, res, next, req.params[FOLLOWING_ID], FOLLOWING_MODEL_NAME),
    followingDoesntExist: (req, res, next) => hasNoMatchingDocument(req, res, next, FOLLOWING_MODEL_NAME, hasNoMatchingDocumentFilter(req))
};

const followingsRouter = express.Router();

followingsRouter
    .use(isAuthenticated)
    .use(ROUTES.WITH_FOLLOWING_ID, mw.hasFollowingIdRouteParam, mw.isValidFollowingId, mw.followingExists);

followingsRouter
    .route(ROUTES.BASE)
    .get(mw.hasFollowingFilter, followingController.getFollowings)
    .post(mw.hasRequiredBodyParams, mw.followingDoesntExist, followingController.createFollowing);

followingsRouter
    .route(ROUTES.WITH_FOLLOWING_ID)
    .get(followingController.getFollowingById)
    .delete(followingController.deleteFollowingById);

export default followingsRouter;
export { ROUTES };