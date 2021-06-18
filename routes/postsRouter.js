import express from 'express';
import * as postController from '../controllers/postController.js';

const postsRouter = express.Router();

postsRouter
    .route('/:uid')
    .get(postController.getUserPosts)
    .post(postController.createUserPost)

export default postsRouter;