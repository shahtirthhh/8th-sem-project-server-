// new Date().toDateString() -> Should be used universally in this project. No other Formats !!
// Hard coded value of the collector email is at getCollectorSocket Query in citizen resolvers, update it when to change collector mail in DB
import "dotenv/config";
import EXPRESS, { NextFunction, Request, Response } from "express";
import MONGOOSE from "mongoose";
import CORS from "cors";
import HTTP from "http";
import { graphqlHTTP } from "express-graphql";
import JWT from "jsonwebtoken";

const { error } = require("./helpers/error_printer");
const { Server } = require("socket.io");
const BODYPARSER = require("body-parser");
const SCHEMA = require("./graphql/schemas/index");
const RESOLVERS = require("./graphql/resolvers/index");

const ROUTER = EXPRESS();
const SERVER = HTTP.createServer(ROUTER);
const IO = new Server(SERVER, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
});
interface AuthenticationRequest extends Request {
  isAuth?: boolean;
  email?: string; // Assuming you want to add email to the request
}
interface TokenPayload extends JWT.JwtPayload {
  email: string;
}
ROUTER.use(BODYPARSER.json({ limit: "50mb" }));
ROUTER.use(BODYPARSER.urlencoded({ limit: "50mb", extended: true }));
ROUTER.use(CORS());
IO.on("connect", (socket: any) => {
  console.log(`\n💖 New user connected - ${new Date().toLocaleTimeString()}`);
  socket.emit("get_my_socket_id", socket.id);

  socket.on(
    "citizen-ready-to-join",
    (data: { citizen: string; citizen_email: string; collector: string }) => {
      socket.to(data.collector).emit("citizen-ready-to-join", {
        citizen: data.citizen,
        citizen_email: data.citizen_email,
      });
    }
  );
  socket.on(
    "callUser",
    (data: { userToCall: string; signalData: any; from: string }) => {
      socket
        .to(data.userToCall)
        .emit("callUser", { signal: data.signalData, from: data.from });
    }
  );
  socket.on("answerCall", (data: any) => {
    socket.to(data.to).emit("callAccepted", data.signal);
  });
  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("clerk-disconnected", async (data: any) => {
    // const updated = await CLERK_SCHEMA.updateOne(
    //   { callId: socket.id },
    //   { $set: { callId: null } }
    // );
  });
  socket.on("end-call", (data: any) => {
    socket.to(data.citizen).emit("end-call");
  });
});

ROUTER.use(
  "/graphql",
  (req: AuthenticationRequest, res: Response, next: NextFunction) => {
    const authHeader = req.get("Authorization");
    if (!authHeader) {
      // console.log("Header not found");
      req.isAuth = false;
      next();
    } else if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (!token) {
        // console.log("Token not found");
        // Handle the case when there is no token
        req.isAuth = false;
        next();
      } else {
        let decoded;
        try {
          decoded = JWT.verify(
            token,
            process.env.TOKEN_GENERATION_SECRET_KEY!
          ) as TokenPayload;
        } catch (err) {
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
  }
);

ROUTER.use(
  "/graphql",
  graphqlHTTP({
    schema: SCHEMA,
    rootValue: RESOLVERS,
    graphiql: true,
  })
);

const PORT = process.env.PORT || 5000;
MONGOOSE.connect(process.env.URI!)
  .then(() => {
    console.log(`
        \n____________________________________________________\n
        🎉 Database connected\n
        Server listening at port ${PORT}
    `);
    SERVER.listen(PORT);
  })
  .catch((error) => console.log("Error connecting to the Database."));
