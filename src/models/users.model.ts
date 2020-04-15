import mongoose from "mongoose";
import { UserSchema, UserWithPassword, IUsers, UserDto } from "../schemas";

export const UsersModel = mongoose.model<UserWithPassword>("user", UserSchema);

export const User = (user: UserWithPassword): UserDto => ({
	_id: user._id,
	email: user.email,
	nickname: user.nickname,
	createdAt: user.createdAt,
	updatedAt: user.updatedAt,
	preference: user.preference,
	gender: user.gender
})