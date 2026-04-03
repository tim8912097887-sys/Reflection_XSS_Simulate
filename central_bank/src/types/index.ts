import mongoose from "mongoose";

export type CleanupFn = () => Promise<void> | void;

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
}

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

export type AuthModelType = mongoose.Model<IUser, object, IUserMethods>;
