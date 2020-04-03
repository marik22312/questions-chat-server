import axios from 'axios';

export class QuestionsService {
	private _baseUrl: string;
	private questionsCache: any[] = [];

	constructor(baseUrl: string) {
		this._baseUrl = baseUrl + '/questions';

		this.getQuestionsFromApi();
	}

	public async getOneQuestion(): Promise<string> {
		if (!this.questionsCache.length) {
			await this.getQuestionsFromApi();
		}

		return this.questionsCache.shift().question;
	}

	private async getQuestionsFromApi(): Promise<void> {
		const response = await axios.get(this._baseUrl + '?filter={}');
		this.questionsCache = [...response.data.questions];
		return;
	}

}