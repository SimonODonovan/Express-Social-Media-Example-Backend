import express from "express";
import session from "express-session";
import redis from "redis";
import connectRedis from "connect-redis";
import usersRouter from "./routes/usersRouter.js";
import postsRouter from "./routes/postsRouter.js";
import likesRouter from "./routes/likesRouter.js";
import followingsRouter from "./routes/followingsRouter.js";
import mongoose from "mongoose";
import passport from "passport";
import * as strategies from "./lib/passportStrategies/passportStrategies.js";
import { API_ROUTES } from "./constants/apiRoutes.js";
import cors from "cors";

const app = express();

app.use(cors());

// Set body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to mongo
const connectWithRetry = () => {
    const mongoUrl = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_IP}:${process.env.MONGO_PORT}/postan?authSource=admin`;
    console.log("Attempting connection to db.");
    mongoose
        .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
        .then(() => console.log("Connected to db successfully."))
        .catch(e => {
            console.log(e);
            console.log("Retrying db connection...");
            setTimeout(connectWithRetry, 5000);
        });
};
connectWithRetry();

// Set up redis store
const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
    host: process.env.REDIS_URL || "redis",
    port: process.env.REDIS_PORT || 6379
});

// // Set up express-session
app.use(session({
    store: new RedisStore({ client: redisClient }),
    secret: process.env.REDIS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, //todo set true
        httpOnly: false, //todo set true
        maxAge: 60000000
    }
}));

// Set up Passport
passport.use(strategies.localStrategy);
passport.serializeUser(strategies.serializeUser);
passport.deserializeUser(strategies.deserializeUser);

app.use(passport.initialize());
app.use(passport.session());

// Mount routers
app.use(API_ROUTES.USERS, usersRouter);
app.use(API_ROUTES.POSTS, postsRouter);
app.use(API_ROUTES.LIKES, likesRouter);
app.use(API_ROUTES.FOLLOWINGS, followingsRouter);

const port = process.env.EXPRESS_PORT;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});