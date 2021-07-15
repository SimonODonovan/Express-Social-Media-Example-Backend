import express from "express";
import { USER_MODEL_FIELDS } from "../constants/userConstants.js";
import * as authController from "../controllers/authController.js";
import * as userController from "../controllers/userController.js";

const ROUTES = {
    SIGNUP: "/signup",
    LOGIN: "/login",
    CHECK_EMAIL: `/check-email/${USER_MODEL_FIELDS.EMAIL}`
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

export default usersRouter;
export { ROUTES };