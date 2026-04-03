import { AuthModelType } from "@/types/index.js";
import { CreateUserType } from "./schema/signup.js";

export default class AuthRepository {
  constructor(private readonly authQuery: AuthModelType) {}

  getUserByEmail = async (email: string, hasPassword: boolean) => {
    let existUser;
    if (hasPassword) {
      existUser = await this.authQuery.findOne({ email }).select("+password");
    } else {
      existUser = await this.authQuery.findOne({ email });
    }
    return existUser;
  };

  createUser = async (userInfo: CreateUserType) => {
    const createdUser = await this.authQuery.create(userInfo);
    const userObject = createdUser.toObject();
    const { password, ...withoutPassword } = userObject;
    if (password) return withoutPassword;
    return userObject;
  };
}
