import { info, error } from "./logger.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const requestLogger = (req, res, next) => {
  info("Method:", req.method);
  info("Path:  ", req.path);
  info("Body:  ", req.body);
  info("---");
  next();
};

const tokenExtractor = (req, res, next) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    req.token = authorization.replace("Bearer ", "");
  }
  next();
};

const userExtractor = async (req, res, next) => {
  if (req.token) {
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET);
    if (decodedToken.id) {
      req.user = await User.findById(decodedToken.id);
    }
  }
  next();
};

const unknownEndpoint = (req, res) =>
  res.status(404).send({ error: "unknown endpoint!" });

const errorHandler = (err, req, res, next) => {
  error(err.message);

  if (err.name === "CastError") {
    return res.status(400).send({ error: "malformatted id!" });
  } else if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  } else if (
    err.name === "MongoServerError" &&
    err.message.includes("E11000 duplicate key error")
  ) {
    return res.status(400).json({ error: "expected `username` to be unique" });
  } else if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "token invalid" });
  }

  next(err);
};

export {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler,
};
