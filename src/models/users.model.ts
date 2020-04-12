import mongoose from "mongoose";
import { UserSchema, IUsers } from "../schemas";

export const UsersModel = mongoose.model<IUsers>("user", UserSchema);
