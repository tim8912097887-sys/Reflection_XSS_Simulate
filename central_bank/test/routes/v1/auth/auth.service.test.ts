import { jest, describe, expect, it, beforeAll } from "@jest/globals";
import AuthRepository from "@/routes/v1/auth/auth.repository.js";
import AuthService from "@/routes/v1/auth/auth.service.js";
import {
  createMockedUser,
  loginInfo,
  registerInfo,
} from "../../../utils/auth.js";

describe("Auth Service Unit Test", () => {
  let authService: AuthService;
  let authRepository: jest.Mocked<AuthRepository>;

  // Mocking the dependencies of AuthService
  beforeAll(() => {
    authRepository = {
      getUserByEmail: jest.fn(),
      createUser: jest.fn(),
    } as unknown as jest.Mocked<AuthRepository>;

    authService = new AuthService(authRepository);
  });

  describe("Login User", () => {
    it("When Login with not exist email,should throw bad request error", async () => {
      // Arrange
      const notExistEmail = "nonexistent@example.com";
      authRepository.getUserByEmail.mockResolvedValue(null);
      // Act & Assert
      await expect(
        authService.login(loginInfo({ email: notExistEmail })),
      ).rejects.toThrow("Invalid email or password");
    });

    it("When Login with incorrect password,should throw bad request error", async () => {
      // Arrange
      const notMatchPassword = "Notmatch123?";
      const mockedUser = createMockedUser({}) as any;
      mockedUser.comparePassword.mockResolvedValue(false);
      authRepository.getUserByEmail.mockResolvedValue(mockedUser);
      // Act & Assert
      await expect(
        authService.login(loginInfo({ password: notMatchPassword })),
      ).rejects.toThrow("Invalid email or password");
    });

    it("When Login with correct credentials,should return user and token", async () => {
      // Arrange
      const mockedUser = createMockedUser({}) as any;
      mockedUser.comparePassword.mockResolvedValue(true);
      authRepository.getUserByEmail.mockResolvedValue(mockedUser);
      // Act
      const result = await authService.login(loginInfo({}));
      // Assert
      expect(result.existUser).toMatchObject(mockedUser);
    });
  });

  describe("Register User", () => {
    it("When registering a new user,should create a new user and return it", async () => {
      // Arrange
      const userInfo = registerInfo({});
      const createdUser = createMockedUser({
        ...userInfo,
      }) as any;
      authRepository.getUserByEmail.mockResolvedValue(null);
      authRepository.createUser.mockResolvedValue(createdUser);
      // Act
      const result = await authService.signup(userInfo);
      // Assert
      expect(authRepository.getUserByEmail).toHaveBeenCalledWith(
        userInfo.email,
        false,
      );
      expect(authRepository.createUser).toHaveBeenCalledWith(userInfo);
      expect(result?.createdUser).toMatchObject(createdUser);
    });

    it("When registering with exist email,should return undefined", async () => {
      // Arrange
      const userInfo = registerInfo({});
      const createdUser = createMockedUser({
        ...userInfo,
      }) as any;
      authRepository.getUserByEmail.mockResolvedValue(createdUser);
      // Act
      const result = await authService.signup(userInfo);
      // Assert
      expect(authRepository.getUserByEmail).toHaveBeenCalledWith(
        userInfo.email,
        false,
      );
      expect(result).toBeUndefined();
    });
  });
});
