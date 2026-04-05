import "express-async-errors";
import express, { json } from "express";
import cors from "cors";
import { connect } from "mongoose";
import { MONGODB_URI } from "./utils/config.js";
import { info, error as _error } from "./utils/logger.js";
import {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
} from "./utils/middleware.js";
import userRouter from "./controllers/user.js";
import messageRouter from "./controllers/message.js";

const app = express();

info("connected to", MONGODB_URI);

connect(MONGODB_URI)
  .then(() => info("Connected to MongoDB"))
  .catch((error) => _error("error connecting to MongoDB:", error.message));

app.use(cors());
app.use(json({ limit: "10mb" }));
app.use(requestLogger);
app.use(tokenExtractor);

app.use("/api/user", userExtractor, userRouter);
app.use("/api/messages", userExtractor, messageRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
