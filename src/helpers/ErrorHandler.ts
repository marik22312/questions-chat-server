import { Response } from "express";

export class ErrorHandler extends Error {
	constructor(public statusCode: number, public message: string) {
		super();
	}
}

export const handleError = (err: ErrorHandler, res: Response) => {
	const { statusCode, message } = err;
	res.status(statusCode).json({
		status: "error",
		statusCode,
		message,
	});
};
