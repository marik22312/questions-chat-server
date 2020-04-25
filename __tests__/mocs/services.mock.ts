import {UsersServiceInterface} from '../../src/services/UsersService'

export const usersServiceMock = (): UsersServiceInterface => ({
	getByEmail: jest.fn(),
	getById: jest.fn(),
	create: jest.fn(),
})