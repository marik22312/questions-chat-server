import { Document, Schema, SchemaTimestampsConfig } from "mongoose";

export interface IUsers extends Document, SchemaTimestampsConfig {
	email: string;
	nickname: string;
	gender: 'M' | 'F';
	preference: 'M' | 'F' | 'A';
}

export interface UserWithPassword extends IUsers {
	password: string;
}

export interface UserDto extends SchemaTimestampsConfig {
	_id: string;
	email: string;
	nickname: string;
	preference: 'M' | 'F' | 'A',
	gender: 'M' | 'F',
}

export interface RegistrationData {
	email: string;
	nickname: string;
	gender: IUsers['gender'];
	preference: IUsers['preference'];
	password?: string;
}

export const UserSchema: Schema<UserWithPassword> = new Schema({
	email: {
		type: Schema.Types.String,
		required: true,
		unique: true,
		index: true,
	},
	nickname: {
		type: Schema.Types.String,
		required: true,
		unique: true,
		index: true,
	},
	password: {
		type: Schema.Types.String,
		required: true,
		// select: false
	},
	gender: {
		type: Schema.Types.String,
		required: true,
		enum: ['M', 'F']
	},
	preference: {
		type: Schema.Types.String,
		required: true,
		enum: ['M', 'F', 'A']
	},
}, {
	timestamps: true
});
