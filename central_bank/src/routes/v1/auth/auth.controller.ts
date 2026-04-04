import { RequestHandler } from "express";
import AuthService from "./auth.service.js";
import { responseEnvelope } from "@/utils/responseEnvelope.js";
import AuthPresenter from "./auth.presenter.js";
import { logger } from "@/configs/logger.js";
import { env } from "@/configs/env.js";
import { ServerError } from "@/customs/error/httpError.js";
import { sendSuccessResponse } from "@/utils/sendResponse.js";

export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  loginUser: RequestHandler = async (req, res) => {
    const { existUser: user } = await this.authService.login(req.validData);
    req.session.user = user;
    const data = AuthPresenter.toLoginResponse(user, "Login successfully");
    sendSuccessResponse(
      res,
      responseEnvelope({
        state: "success",
        data,
      }),
    );
  };

  signupUser: RequestHandler = async (req, res) => {
    await this.authService.signup(req.validData);
    const data = AuthPresenter.toMessageResponse("Signup successfully");
    sendSuccessResponse(
      res,
      responseEnvelope({
        state: "success",
        data,
      }),
      201,
    );
  };

  logout: RequestHandler = async (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        logger.error("Error destroying session during logout", { error: err });
        throw new ServerError(
          "An unexpected error occurred while logging out.",
        );
      }

      res.clearCookie("connect.sid", {
        secure: env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "strict", // Prevent CSRF attacks
        httpOnly: false,
      });

      const data = AuthPresenter.toMessageResponse("Logout successfully");
      sendSuccessResponse(
        res,
        responseEnvelope({
          state: "success",
          data,
        }),
      );
    });
  };
}
