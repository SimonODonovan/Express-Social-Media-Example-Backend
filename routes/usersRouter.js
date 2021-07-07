import express from "express";
import * as authController from "../controllers/authController.js";

const ROUTES = {
    SIGNUP: "/signup",
    LOGIN: "/login",
    TEST: "/test"
};

const usersRouter = express.Router();

usersRouter
    .route(ROUTES.SIGNUP)
    .post(authController.signup);

usersRouter
    .route(ROUTES.LOGIN)
    .post(authController.login);

export default usersRouter;
export { ROUTES };