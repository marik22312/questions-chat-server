import { UsersService } from "../services/UsersService";
import * as Joi from "@hapi/joi";
import { Request, Response } from "express";
import { IdentityService } from "../services/identity.service";
import { IUsers } from '../schemas';

export interface RegistrationBody {
	email: string;
	password: string;
}

export class UsersController {
	constructor(
		private usersService: UsersService,
		private identityService: IdentityService
	) {
		this.registerNewUser = this.registerNewUser.bind(this);
	}

	public async registerNewUser(req: Request, res: Response) {
		const validationSchema = Joi.object().keys({
			email: Joi.string().email().required(),
			password: Joi.string().min(8).required(),
		});

		const validation = validationSchema.validate(req.body);

		if (validation.error) {
			return res.send(validation.error.message);
		}
		const body = req.body as RegistrationBody;
		const passwordHash = await this.identityService.hashPassword(body.password);
		const user = await this.usersService.create(body.email, passwordHash);
		const token = this.identityService.signAuthToken(user);
		return res.json({
			token,
			user
		})
	}

	public async loginUser() {
		return;
	}

	public async authenticateUser() {
		return;
	}
}
