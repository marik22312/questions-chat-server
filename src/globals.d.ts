declare namespace NodeJS {
	export interface ProcessEnv {
		PORT: string;
		BASE_QUESTION_URI: string;
	}
  }

  declare module 'logzio-nodejs';