declare namespace NodeJS {
	export interface ProcessEnv {
		PORT: string;
		BASE_QUESTION_URI: string;
		MONGODB_URI: string;
		SECRET_AUTH_TOKEN: string;
	}
  }

  declare module 'logzio-nodejs';