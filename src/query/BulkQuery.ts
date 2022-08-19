import { HTTPError } from "../class/error/HTTPError";
import { AccessToken, FullUserID } from "../types/Types";
import { Query, QueryResponse, QueryType } from "./Query";

type BulkQueryType = QueryType.Deactivate;

export type BulkQueryParams = {
	[QueryType.Deactivate]: {
		users: FullUserID[];
	}
}

export abstract class BulkQuery<T extends BulkQueryType>{

	con: AbortController;
	token: AccessToken;
	data: BulkQueryParams[T];
	homeserver: string;
	abstract queries: Query<T>[];

	constructor(homeserver: string, data: BulkQueryParams[T], token: AccessToken){
		this.con = new AbortController();
		this.token = token;
		this.data = data;
		this.homeserver = /https?:\/\/.+/.test(homeserver) ? homeserver : `https://${homeserver}`;
	}

	async send(){
		setTimeout(() => {
			if(!this.con.signal.aborted) this.con.abort();
		}, 10000);
		const results = [];
		for(const q of this.queries) results.push(q.fetch());
		const res = await Promise.allSettled(results);
		return await this.process(res);
	}

	abstract fetch(): Promise<Response[]>;

	private async process(res: PromiseSettledResult<Response>[]) {
		const results = [];
		for(const r of res){
			if(r.status === 'fulfilled'){
				const ret = (await r.value.json()) as QueryResponse[T];
				if(r.value.status < 200 || r.value.status > 299) results.push(new HTTPError(r.value.status));
				results.push(ret);
			} else results.push(null);
		}
		console.log(results);
		return results;
	}
}