import {
  jest,
  describe,
  expect,
  it,
  beforeAll,
  beforeEach,
} from "@jest/globals";
import AuthService from "@/routes/v1/auth/auth.service.js";
import {
  createMockedUser,
  loginInfo,
  registerInfo,
  successResponse,
} from "../../../utils/auth.js";
import AuthController from "@/routes/v1/auth/auth.controller.js";
import { NextFunction, Request, Response } from "express";
import { Session } from "express-session";
import { UnauthorizedError } from "@/customs/error/httpError.js";
import AuthPresenter from "@/routes/v1/auth/auth.presenter.js";

describe("Auth Controller Unit Test", () => {
  const req: jest.Mocked<Request> = {} as unknown as jest.Mocked<Request>;
  const res: jest.Mocked<Response> = {} as unknown as jest.Mocked<Response>;
  const next: jest.Mocked<NextFunction> =
    jest.fn() as unknown as jest.Mocked<NextFunction>;
  let authController: AuthController;
  let authService: jest.Mocked<AuthService>;

  // Mocking the dependencies of AuthService
  beforeAll(() => {
    authService = {
      login: jest.fn(),
      signup: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    authController = new AuthController(authService);
  });

  beforeEach(() => {
    res.status = jest.fn().mockReturnThis() as any;
    res.json = jest.fn().mockReturnThis() as any;
  });

  describe("Login User", () => {
    it("When Login with not exist email,should throw bad request error", async () => {
      // Arrange
      const notExistEmail = "nonexistent@example.com";
      const loginCredentials = loginInfo({ email: notExistEmail });
      req.validData = loginCredentials;
      authService.login.mockRejectedValue(
        new UnauthorizedError("Invalid email or password"),
      );
      // Act & Assert
      await expect(authController.loginUser(req, res, next)).rejects.toThrow(
        "Invalid email or password",
      );
    });

    it("When Login with incorrect password,should throw bad request error", async () => {
      // Arrange
      const notMatchPassword = "Notmatch123?";
      const loginCredentials = loginInfo({ password: notMatchPassword });
      req.validData = loginCredentials;
      authService.login.mockRejectedValue(
        new UnauthorizedError("Invalid email or password"),
      );
      // Act & Assert
      await expect(authController.loginUser(req, res, next)).rejects.toThrow(
        "Invalid email or password",
      );
    });

    it("When Login with correct credentials,should response user and success message", async () => {
      // Arrange
      const existUser = createMockedUser({}) as any;
      const loginCredentials = loginInfo({});
      req.session = {} as unknown as jest.Mocked<Session>;
      req.validData = loginCredentials;
      authService.login.mockResolvedValue({ existUser });
      // Act
      await authController.loginUser(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        successResponse(
          AuthPresenter.toLoginResponse(existUser, "Login successfully"),
        ),
      );
      expect(req.session.user).toMatchObject(existUser);
    });
  });

  describe("Register User", () => {
    it("When registering a new user,should response with success message", async () => {
      // Arrange
      const userInfo = registerInfo({});
      const createdUser = createMockedUser({
        ...userInfo,
      }) as any;
      req.validData = userInfo;
      authService.signup.mockResolvedValue({ createdUser });
      // Act
      await authController.signupUser(req, res, next);
      // Assert
      expect(authService.signup).toHaveBeenCalledWith(userInfo);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        successResponse(AuthPresenter.toMessageResponse("Signup successfully")),
      );
    });

    it("When registering with exist email,should response with success message", async () => {
      // Arrange
      const userInfo = registerInfo({});
      req.validData = userInfo;
      authService.signup.mockResolvedValue(undefined);

      // Act
      await authController.signupUser(req, res, next);
      // Assert
      expect(authService.signup).toHaveBeenCalledWith(userInfo);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        successResponse(AuthPresenter.toMessageResponse("Signup successfully")),
      );
    });
  });
});
