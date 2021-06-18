import express from "express";
import * as authController from '../controllers/authController.js';
import isAuthenticated from "../middleware/isAuthenticated.js";

const usersRouter = express.Router();

usersRouter
    .route("/signup")
    .post(authController.signup);

usersRouter
    .route("/login")
    .post(authController.login);

usersRouter
    .route("/test")
    .get(isAuthenticated, (req, res, next) => {
        return res.status(200).json("/Test")
    });

export default usersRouter;