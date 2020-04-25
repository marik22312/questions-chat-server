import Server from '../index';
import request from 'supertest';
import { response } from 'express';
import { connect, disconnect } from '../models';

describe('E2E Test Suite', () => {
	let server: any;

	beforeAll(async () => {
		await connect();
		server = request(Server);
	});

	it('Server should be alive', async () => {
		const repsonse = await server.get('/');
		expect(response.statusCode).toBe(200);
		console.log('Response.', response.statusCode)
	})

	afterAll((done) => {
		disconnect(done);
	})
})