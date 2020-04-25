import { IUsers, UserDto } from "../schemas";
import { sign, verify } from "jsonwebtoken";
import { UsersService } from "./UsersService";

import bcrypt from "bcrypt";
import { User } from '../models';
import { ErrorHandler } from '../helpers/ErrorHandler';
// import { OAuth2Client } from "google-auth-library";

export interface IdentityServiceConstructorProps {
	secret: string;
	usersService: any;
}

export interface AuthUserObj {
	_id: IUsers["_id"];
	email: IUsers["email"];
}
export interface VerifiedUserDto {
	_id: IUsers["_id"];
}

export interface AuthenticationResponse {
	user: UserDto;
	token: string;
}

export class IdentityService {
	public static readonly DEFAULT_TOKEN_EXPIRATION: number = 1000 * 60 * 60 * 15; // ms s m d

	private readonly secret: string;
	private readonly usersService: UsersService;
	// private readonly oauthClient: OAuth2Client;

	constructor(constructorObj: IdentityServiceConstructorProps) {
		this.secret = constructorObj.secret;
		this.usersService = constructorObj.usersService;
		// this.oauthClient = new OAuth2Client(GOOGLE_AUTH_API_KEY);
	}

	public signAuthToken(user: AuthUserObj): string {
		return sign(user, this.secret, {
			expiresIn: IdentityService.DEFAULT_TOKEN_EXPIRATION,
		});
	}

	public verifyToken(token: string): AuthUserObj | null {
		try {
			return verify(token, this.secret) as AuthUserObj;
		} catch (err) {
			return null;
		}
	}

	public async authenticateUserByEmailAndPassword(
		email: string,
		password: string,
	): Promise<AuthenticationResponse> {
		const user = await this.usersService.getByEmail(email);
		if (!user) {
			throw new ErrorHandler(400, "Wrong email or password");
		}
		const isMatch = await this.compareHash(password, user.password);
		if (!isMatch) {
			throw new ErrorHandler(400, "Wrong email or password");
		}

		const userAuthObj = User(user);
		const token = this.signAuthToken(userAuthObj);
		const response: AuthenticationResponse = {
			user: User(user),
			token,
		};

		return response;
	}

	// public async authenticateByGoogle(
	// 	idToken: string,
	// ): Promise<AuthenticationResponse> {
	// 	const ticket = await this.oauthClient.verifyIdToken({
	// 		idToken,
	// 		audience: GOOGLE_AUTH_AUD_KEY,
	// 	});
	// 	const payload = ticket.getPayload();

	// 	if (!payload || !payload.email_verified || !payload.email) {
	// 		throw new Error('Email Is Not verified!');
	// 	}

	// 	const email = payload.email;
	// 	const user = await this.usersService.getUserByEmail(email);
	// 	if (!user) {
	// 		throw Error("Wrong email or password");
	// 	}

	// 	const userAuthObj: AuthUserObj = {
	// 		_id: user._id,
	// 		email: user.email,
	// 	};
	// 	const token = this.signAuthToken(userAuthObj);
	// 	const response: AuthenticationResponse = {
	// 		user: userAuthObj,
	// 		token,
	// 	};

	// 	return response;
	// }

	public hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, 10);
	}

	public compareHash(password: string, hash: string): Promise<boolean> {
		return bcrypt.compare(password, hash);
	}
}
