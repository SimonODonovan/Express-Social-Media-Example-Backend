import express from "express";
import passport from "passport";
import * as strategies from "../../../../lib/passportStrategies/passportStrategies.js";

let server;
const app = express();
const PORT = 3002;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

passport.use(strategies.localStrategy);
passport.serializeUser(strategies.serializeUser);
passport.deserializeUser(strategies.deserializeUser);

app.use(passport.initialize());
app.use(passport.session());

const startServer = (serverPort = PORT) => {
    server = app.listen(serverPort);
};

/* istanbul ignore next */
const stopServer = () => {
    if (server) 
        server.close();
};

export default app;
export { startServer, stopServer };