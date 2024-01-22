"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// new Date().toDateString() -> Should be used universally in this project. No other Formats !!
// Hard coded value of the collector email is at getCollectorSocket Query in citizen resolvers, update it when to change collector mail in DB
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const express_graphql_1 = require("express-graphql");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { error } = require("./helpers/error_printer");
const { Server } = require("socket.io");
const BODYPARSER = require("body-parser");
const SCHEMA = require("./graphql/schemas/index");
const RESOLVERS = require("./graphql/resolvers/index");
const ROUTER = (0, express_1.default)();
const SERVER = http_1.default.createServer(ROUTER);
const IO = new Server(SERVER, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"],
    },
});
ROUTER.use(BODYPARSER.json({ limit: "50mb" }));
ROUTER.use(BODYPARSER.urlencoded({ limit: "50mb", extended: true }));
ROUTER.use((0, cors_1.default)());
IO.on("connect", (socket) => {
    console.log(`\n💖 New user connected - ${new Date().toLocaleTimeString()}`);
    socket.emit("get_my_socket_id", socket.id);
    socket.on("citizen-ready-to-join", (data) => {
        socket.to(data.collector).emit("citizen-ready-to-join", {
            citizen: data.citizen,
            citizen_email: data.citizen_email,
        });
    });
    socket.on("callUser", (data) => {
        socket
            .to(data.userToCall)
            .emit("callUser", { signal: data.signalData, from: data.from });
    });
    socket.on("answerCall", (data) => {
        socket.to(data.to).emit("callAccepted", data.signal);
    });
    socket.on("disconnect", () => {
        socket.broadcast.emit("callEnded");
    });
    socket.on("clerk-disconnected", async (data) => {
        // const updated = await CLERK_SCHEMA.updateOne(
        //   { callId: socket.id },
        //   { $set: { callId: null } }
        // );
    });
    socket.on("end-call", (data) => {
        socket.to(data.citizen).emit("end-call");
    });
});
ROUTER.use("/graphql", (req, res, next) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        // console.log("Header not found");
        req.isAuth = false;
        next();
    }
    else if (authHeader) {
        const token = authHeader.split(" ")[1];
        if (!token) {
            // console.log("Token not found");
            // Handle the case when there is no token
            req.isAuth = false;
            next();
        }
        else {
            let decoded;
            try {
                decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN_GENERATION_SECRET_KEY);
            }
            catch (err) {
                // console.log("Invalid Token");
                req.isAuth = false;
                next();
                error(err, "decoding the token, malformed token found.");
            }
            if (decoded) {
                req.email = decoded.email;
                req.isAuth = true; // Set isAuth to true
                next();
            }
        }
    }
});
ROUTER.use("/graphql", (0, express_graphql_1.graphqlHTTP)({
    schema: SCHEMA,
    rootValue: RESOLVERS,
    graphiql: true,
}));
const PORT = process.env.PORT || 5000;
mongoose_1.default.connect(process.env.URI)
    .then(() => {
    console.log(`
        \n____________________________________________________\n
        🎉 Database connected\n
        Server listening at port ${PORT}
    `);
    SERVER.listen(PORT);
})
    .catch((error) => console.log("Error connecting to the Database."));
