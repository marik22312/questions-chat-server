import mongoose from "mongoose";

mongoose.set(
	"debug",
	process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test"
);

export const connect = (url: string) =>
	mongoose.connect(url, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
	});
export const disconnect = (done: any) => mongoose.disconnect(done);
export const getStatus = () => mongoose.connection.readyState;
