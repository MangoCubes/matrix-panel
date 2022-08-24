import { AccessToken, FullUserID, RoomID } from "../types/Types";
import { QueryResponse, QueryType } from "./Query";

type BulkQueryType = QueryType.Deactivate | QueryType.DeleteRoom | QueryType.GetRoomState;

export type BulkQueryParams = {
	[QueryType.Deactivate]: {
		users: FullUserID[];
	};
	[QueryType.DeleteRoom]: {
		rooms: RoomID[];
	};
	[QueryType.GetRoomState]: {
		rooms: RoomID[];
	}
}

export abstract class BulkQuery<T extends BulkQueryType>{

	con: AbortController;
	token: AccessToken;
	data: BulkQueryParams[T];
	homeserver: string;

	constructor(homeserver: string, data: BulkQueryParams[T], token: AccessToken){
		this.con = new AbortController();
		this.token = token;
		this.data = data;
		this.homeserver = /https?:\/\/.+/.test(homeserver) ? homeserver : `https://${homeserver}`;
	}

	async send(): Promise<(QueryResponse[T] | null)[]>{
		setTimeout(() => {
			if(!this.con.signal.aborted) this.con.abort();
		}, 10000);
		const results = this.fetch();
		const res = await Promise.allSettled(results);
		return await this.process(res);
	}

	abstract fetch(): Promise<QueryResponse[T]>[];

	private async process(res: PromiseSettledResult<QueryResponse[T]>[]) {
		const results = [];
		for(const r of res){
			if(r.status === 'fulfilled') results.push(r.value as QueryResponse[T]);
			else results.push(null);
		}
		console.log(results);
		return results;
	}
}