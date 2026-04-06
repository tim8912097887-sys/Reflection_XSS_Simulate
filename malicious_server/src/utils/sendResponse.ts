import { Response } from "express";

export const sendSuccessResponse = (
  res: Response,
  response: any,
  statusCode = 200,
) => res.status(statusCode).json(response);