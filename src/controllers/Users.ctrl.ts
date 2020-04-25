import { UsersServiceInterface } from "../services/UsersService";
import * as Joi from "@hapi/joi";
import { Request, Response, NextFunction } from "express";
import { IdentityService } from "../services/identity.service";
import { RegistrationData } from '../schemas';
import { ErrorHandler } from '../helpers/ErrorHandler';


export class UsersController {
	constructor(
		private usersService: UsersServiceInterface,
		private identityService: IdentityService
	) {
		this.registerNewUser = this.registerNewUser.bind(this);
		this.loginUser = this.loginUser.bind(this);
	}

	public async registerNewUser(req: Request, res: Response, next: NextFunction) {
		try {
			const validationSchema = Joi.object().keys({
				email: Joi.string().email().required(),
				password: Joi.string().min(8).required(),
				nickname: Joi.string().min(4).max(64).required(),
				gender: Joi.string().valid("M", "F").required(),
				preference: Joi.string().valid("M", "F", "A").required(),
			});

			const validation = validationSchema.validate(req.body);

			if (validation.error) {
				throw new ErrorHandler(400, validation.error.message);
			}
			const body = req.body as RegistrationData;
			const passwordHash = await this.identityService.hashPassword(
				body.password
			);
			const user = await this.usersService.create(body, passwordHash);
			const token = this.identityService.signAuthToken(user);
			return res.json({
				token,
				user,
			});
		} catch (err) {
			return next(err);
		}
	}

	public async loginUser(req: Request, res: Response, next: NextFunction) {
		try {
			const validationSchema = Joi.object().keys({
				email: Joi.string().email(),
				password: Joi.string(),
			});

			const validation = validationSchema.validate(req.body);

			if (validation.error) {
				return res.send(validation.error.message);
			}

			const body = req.body as RegistrationData;

			const response = await this.identityService.authenticateUserByEmailAndPassword(
				body.email,
				body.password
			);
			return res.json(response);
		} catch (err) {
			return next(err)
		}
	}

	public async authenticateUser() {
		return;
	}
}
