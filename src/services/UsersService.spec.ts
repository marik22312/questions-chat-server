import Chance from "chance";

import { connect, disconnect } from "../models";
import { UsersService } from "./UsersService";
import { RegistrationData, UserWithPassword, IUsers } from "../schemas";

const chance = Chance();

const generateFakeUser = (data?: RegistrationData): RegistrationData => ({
	email: data?.email || chance.email(),
	nickname: data?.nickname || chance.name(),
	gender: data?.gender || (chance.pickone(["M", "F"]) as IUsers["gender"]),
	preference:
		data?.preference ||
		(chance.pickone(["M", "F", "A"]) as IUsers["preference"]),
});

describe("Users Service", () => {
	let usersService: UsersService;
	beforeAll(async () => {
		await connect(global.__MONGO_URI__);
		usersService = new UsersService();
	});

	it("Should create user successfully", async () => {
		const email = chance.email();
		const nickname = chance.word();
		const gender = chance.pickone(["M", "F"]) as "M" | "F";
		const preference = chance.pickone(["M", "F", "A"]) as "M" | "F" | "A";
		const password = chance.hash();
		const user = generateFakeUser({
			email,
			nickname,
			gender,
			preference,
		});
		const createdUser = await usersService.create(user, password);

		expect(createdUser._id).toBeDefined();
		expect(createdUser.email).toBe(email);
		expect(createdUser.password).toBe(password);
		expect(createdUser.nickname).toBe(nickname);
		expect(createdUser.gender).toBe(gender);
		expect(createdUser.preference).toBe(preference);
	});

	it("Should fetch user by email correctly", async () => {
		const user = generateFakeUser();
		const password = chance.hash();

		const createdUser = await usersService.create(user, password);

		const fetchedUser = await usersService.getByEmail(user.email);
		expect(fetchedUser.email).toBe(user.email);
		expect(fetchedUser.password).toBe(password);
		expect(fetchedUser.nickname).toBe(user.nickname);
		expect(fetchedUser.gender).toBe(user.gender);
		expect(fetchedUser.preference).toBe(user.preference);
	});

	it("Should fetch user by Id correctly", async () => {
		const user = generateFakeUser();
		const password = chance.hash();

		const createdUser = await usersService.create(user, password);

		const fetchedUser = await usersService.getById(createdUser._id);
		expect(fetchedUser._id).toStrictEqual(createdUser._id);
		expect(fetchedUser.email).toBe(user.email);
		expect(fetchedUser.password).toBe(password);
		expect(fetchedUser.nickname).toBe(user.nickname);
		expect(fetchedUser.gender).toBe(user.gender);
		expect(fetchedUser.preference).toBe(user.preference);
	});

	it("Should fetch user by email correctly", async () => {
		const user = generateFakeUser();
		const password = chance.hash();

		const createdUser = await usersService.create(user, password);

		const fetchedUser = await usersService.getByEmail(user.email);
		expect(fetchedUser._id).toStrictEqual(createdUser._id);
		expect(fetchedUser.email).toBe(user.email);
		expect(fetchedUser.password).toBe(password);
		expect(fetchedUser.nickname).toBe(user.nickname);
		expect(fetchedUser.gender).toBe(user.gender);
		expect(fetchedUser.preference).toBe(user.preference);
	});
});
