import { logger } from "@/configs/logger.js";
import AuthRepository from "./auth.repository.js";
import { LoginUserType } from "./schema/login.js";
import { CreateUserType } from "./schema/signup.js";
import { BadRequestError } from "@/customs/error/httpError.js";

export default class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  login = async (user: LoginUserType) => {
    const existUser = await this.authRepository.getUserByEmail(
      user.email,
      true,
    );

    if (!existUser) {
      logger.warn(`Login: No user found with email ${user.email}`);
      throw new BadRequestError("Invalid email or password");
    }

    const isPasswordValid = await existUser.comparePassword(user.password);

    if (!isPasswordValid) {
      logger.warn(`Login: Invalid password for email ${user.email}`);
      throw new BadRequestError("Invalid email or password");
    }

    return { existUser };
  };

  signup = async (user: CreateUserType) => {
    const existUser = await this.authRepository.getUserByEmail(
      user.email,
      false,
    );

    if (existUser) {
      logger.warn(`Signup: User already exists with email ${user.email}`);
      return;
    }

    const createdUser = await this.authRepository.createUser(user);
    return { createdUser };
  };
}
