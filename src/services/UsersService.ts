import { Model, SchemaTimestampsConfig } from "mongoose";
import { IUsers, RegistrationData, UserDto, UserWithPassword } from "../schemas";
import { UsersModel } from "../models";

export interface IUsersServiceConstructor {
	model: Model<IUsers>;
}

export interface UsersServiceInterface {
	getById(id: string): Promise<UserWithPassword | null>;
	getByEmail(email: string): Promise<UserWithPassword | null>;
	create(data: RegistrationData, password: string): Promise<UserWithPassword>;
}

export interface Filter {
	categories?: string[];
	difficulties?: string[];
}

export class UsersService implements UsersServiceInterface {
	public static readonly limit: number = 20;

	private readonly model: Model<UserWithPassword>;

	constructor() {
		this.model = UsersModel;
	}

	public getById(id: string): Promise<UserWithPassword | null> {
		return this.model.findById(id).populate("roles").exec();
	}
	public getByEmail(email: string): Promise<UserWithPassword | null> {
		return this.model.findOne({ email }).populate("roles").exec();
	}
	public async create(data: RegistrationData, password: string): Promise<UserWithPassword> {
		return this.model.create({
			email: data.email,
			nickname: data.nickname,
			preference: data.preference,
			gender: data.gender,
			password,
		});
	}
}
