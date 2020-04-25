declare namespace NodeJS {
	export interface ProcessEnv {
		PORT: string;
		BASE_QUESTION_URI: string;
		MONGODB_URI: string;
		SECRET_AUTH_TOKEN: string;
	}

	export interface Global {
		__MONGO_URI__: string;
	}
  }

  declare module 'logzio-nodejs';