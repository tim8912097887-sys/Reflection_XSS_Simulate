import { RequestHandler } from "express";
import AuthService from "./auth.service.js";
import { responseEnvelope } from "@/utils/responseEnvelope.js";
import AuthPresenter from "./auth.presenter.js";

export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  loginUser: RequestHandler = async (req, res) => {
    const { existUser: user } = await this.authService.login(req.validData);
    const data = AuthPresenter.toLoginResponse(user, "Login successfully");
    res.status(200).json(
      responseEnvelope({
        state: "success",
        data,
      }),
    );
  };

  signupUser: RequestHandler = async (req, res) => {
    await this.authService.signup(req.validData);
    const data = AuthPresenter.toMessageResponse("Signup successfully");
    res.status(201).json(
      responseEnvelope({
        state: "success",
        data,
      }),
    );
  };

  logout: RequestHandler = async (_req, res) => {
    await this.authService.logout();
    const data = AuthPresenter.toMessageResponse("Logout successfully");
    res.status(200).json(
      responseEnvelope({
        state: "success",
        data,
      }),
    );
  };
}
