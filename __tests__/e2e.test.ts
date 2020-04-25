import Chance from "chance";

import { app, httpServer } from "../src";
import request, { SuperTest, Test } from "supertest";

const chance = Chance();

describe("E2E Test Suite", () => {
	let server: SuperTest<Test>;

	beforeAll(async () => {
		server = request(app);
	});

	it("Server should be alive", async () => {
		const response = await server.get("/status");
		expect(response.status).toBe(200);
		expect(response.body.server).toBe(true);
	});

	it('Should redirect to docs', async () => {
		const response = await server.get("/");
		expect(response.status).toBe(302);
	})

	describe("Users tests", () => {
		it("Should do registration flow correctly", async () => {
			const loginBody = {
				email: chance.email(),
				password: chance.word(),
			};
			const response = await server.post("/register");
			expect(response.status).toBe(400);
		});
	});

	afterAll((done) => {
		httpServer.close();
	});
});
