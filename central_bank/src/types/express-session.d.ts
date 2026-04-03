import "express-session";
import { IUser } from "./index.ts";

declare module "express-session" {
  interface SessionData {
    user: Omit<IUser, "password">;
  }
}
