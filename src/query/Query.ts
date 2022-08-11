import { HTTPError } from "../class/error/HTTPError";
import { AccessToken, DeviceID, FullUserID, Homeserver, UserID } from "../types/Types";

export enum QueryType{
	Login
}

export type QueryResponse = {
	[QueryType.Login]: {
		access_token: AccessToken,
		device_id: DeviceID,
		user_id: FullUserID
	}
}

export type NeedToken<T extends QueryType> = T extends Exclude<QueryType, QueryType.Login> ? AccessToken : null;

export type QueryParams = {
	[QueryType.Login]: {
		uid: UserID,
		password: string
	};
}

export abstract class Query<T extends QueryType>{

	con: AbortController;
	token: NeedToken<T>;
	data: QueryParams[T];
	homeserver: Homeserver;

	constructor(homeserver: Homeserver, data: QueryParams[T], token: NeedToken<T>){
		this.con = new AbortController();
		this.token = token;
		this.data = data;
		this.homeserver = /https?:\/\/.+/.test(homeserver) ? homeserver : `https://${homeserver}` as Homeserver;
	}

	async send(){
		setTimeout(() => {
			if(!this.con.signal.aborted) this.con.abort();
		}, 10000);
		const res = await this.fetch();
		return await this.process(res);
	}

	abstract fetch(): Promise<Response>;

	private async process(res: Response) {
		if(res.status < 200 || res.status > 299) throw new HTTPError(res.status);
		const ret = (await res.json()).data as QueryResponse[T];
		return ret;
	}
}