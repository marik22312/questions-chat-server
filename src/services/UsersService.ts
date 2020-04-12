import { Model, SchemaTimestampsConfig } from "mongoose";
import { IUsers } from "../schemas";
import { UsersModel } from "../models";

export interface IUsersServiceConstructor {
	model: Model<IUsers>;
}

export interface UserDto extends SchemaTimestampsConfig {
	_id: string;
	email: string;
}

export interface Filter {
	categories?: string[];
	difficulties?: string[];
}

export class UsersService {
	public static readonly limit: number = 20;

	private readonly model: Model<IUsers>;

	constructor() {
		this.model = UsersModel;
	}

	public getById(id: string): Promise<IUsers | null> {
		return this.model.findById(id).populate("roles").exec();
	}
	public getByEmail(email: string): Promise<IUsers | null> {
		return this.model.findOne({ email }).populate("roles").exec();
	}
	public async create(email: string, password: string): Promise<UserDto> {
		const user = await this.model.create({
			email,
			password,
		});
		return {
			_id: user._id,
			email: user.email,
			createdAt: user.createdAt,
			updatedAt: user.createdAt,
		}
	}
}
