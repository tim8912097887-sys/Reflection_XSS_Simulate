import mongoose from "mongoose";
import { jest, expect } from "@jest/globals";
import { hashPassword } from "@/utils/password.js";
import { AuthModel } from "@/routes/v1/auth/auth.model.js";
import { env } from "@/configs/env.js";

const email = "correct@gmail.com";
const password = "Correct123?";
const username = "correctUser";

export const loginInfo = (overrides: object) => {
  return {
    email,
    password,
    ...overrides,
  };
};

export const registerInfo = (overrides: object) => {
  return {
    email,
    password,
    username,
    ...overrides,
  };
};

export const createMockedUser = (overrides: object) => {
  return {
    _id: new mongoose.Types.ObjectId(),
    email: "test@example.com",
    username: "testUser",
    comparePassword: jest.fn(), // Mock the instance method
    save: jest.fn(),
    ...overrides,
  };
};

export const seedUser = async (overrides: object) => {
  const hashedPassword = await hashPassword(password, env.SALT_ROUNDS);
  const baseUser = {
    email,
    username,
    password: hashedPassword,
  };
  const createdUser = await AuthModel.create({ ...baseUser, ...overrides });
  return createdUser;
};

export const successResponse = (data: Record<string, unknown>) => {
  return {
    state: "success",
    data: expect.objectContaining(data),
    error: null,
    meta: expect.objectContaining({
      timestamp: expect.any(String),
    }),
  };
};

export const errorResponse = (error: Record<string, unknown>) => {
  return {
    state: "error",
    data: null,
    error: expect.objectContaining(error),
    meta: expect.objectContaining({
      timestamp: expect.any(String),
    }),
  };
};
