import { Document, Schema, SchemaTimestampsConfig } from "mongoose";

export interface IUsers extends Document, SchemaTimestampsConfig {
	email: string;
	password: string;
}

export const UserSchema: Schema<IUsers> = new Schema({
	email: {
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
}, {
	timestamps: true
});
