import { UnauthorizedError } from "@/customs/error/httpError.js";
import { RequestHandler } from "express";

export const sessionCheck: RequestHandler = (req, _res, next) => {
  if (req.session.user) {
    next();
  } else {
    throw new UnauthorizedError("Unauthorized");
  }
};
