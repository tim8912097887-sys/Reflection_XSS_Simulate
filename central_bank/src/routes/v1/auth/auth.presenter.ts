import { IUser } from "@/types/index.js";

export default class AuthPresenter {
  constructor() {}

  static toLoginResponse(user: IUser, message: string) {
    const data = {
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      message,
    };
    return data;
  }

  static toMessageResponse(message: string) {
    const data = {
      message,
    };
    return data;
  }
}
