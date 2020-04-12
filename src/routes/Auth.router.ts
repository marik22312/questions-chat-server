import { Router, Request, Response } from "express";
import { IdentityService } from "../services/identity.service";
import { SECRET_AUTH_TOKEN } from "../config";
import { UsersService } from "../services/UsersService";
import BodyParser from 'body-parser';
import cors from 'cors';
import { UsersController } from '../controllers/Users.ctrl';

const router = Router();

const usersService = new UsersService();
const identityService = new IdentityService({
	secret: SECRET_AUTH_TOKEN,
	usersService,
});
const usersController = new UsersController(usersService, identityService);

router
	// .post("/authenticate", async (req: Request, res: Response) => {
	// 	const reqBody = req.body;

	// 	try {
	// 		const response = await identityService.authenticateUserByEmailAndPassword(
	// 			reqBody.email,
	// 			reqBody.password,
	// 		);
	// 		return res.json(response);
	// 	} catch (error) {
	// 		res.status(500).send(error.message);
	// 	}
	// })
	.post("/register", BodyParser.json(), cors(), usersController.registerNewUser)

export const AuthRouter = router;
