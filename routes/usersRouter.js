import express from "express";
import { USER_MODEL_FIELDS } from "../constants/userConstants.js";
import * as authController from "../controllers/authController.js";
import * as userController from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const ROUTES = {
    SIGNUP: "/signup",
    LOGIN: "/login",
    CHECK_EMAIL: `/check-email/:${USER_MODEL_FIELDS.EMAIL}`,
    CHECK_HANDLE: `/check-handle/:${USER_MODEL_FIELDS.HANDLE}`,
    IS_AUTHENTICATED: "/is-authenticated",
};

const usersRouter = express.Router();

usersRouter
    .route(ROUTES.SIGNUP)
    .post(authController.signup);

usersRouter
    .route(ROUTES.LOGIN)
    .post(authController.login);

usersRouter
    .route(ROUTES.CHECK_EMAIL)
    .get(userController.checkEmail);

usersRouter
    .route(ROUTES.CHECK_HANDLE)
    .get(userController.checkHandle);

usersRouter
    .route(ROUTES.IS_AUTHENTICATED)
    .get(isAuthenticated, userController.isAuthenticated);

export default usersRouter;
export { ROUTES };