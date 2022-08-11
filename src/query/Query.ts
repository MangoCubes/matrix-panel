import { HTTPError } from "../class/error/HTTPError";
import { AccessToken, DeviceID, FullUserID, UserID } from "../types/Types";

export enum QueryType{
	IsAdmin,
	Login
}

export type QueryResponse = {
	[QueryType.Login]: {
		access_token: AccessToken,
		device_id: DeviceID,
		user_id: FullUserID
	};
	[QueryType.IsAdmin]: {
		admin: boolean
	};
}

export type NeedToken<T extends QueryType> = T extends Exclude<QueryType, QueryType.Login> ? AccessToken : null;

export type QueryParams = {
	[QueryType.Login]: {
		uid: UserID;
		password: string;
	};
	[QueryType.IsAdmin]: {
		uid: FullUserID;
	}
}

export abstract class Query<T extends QueryType>{

	con: AbortController;
	token: NeedToken<T>;
	data: QueryParams[T];
	homeserver: string;

	constructor(homeserver: string, data: QueryParams[T], token: NeedToken<T>){
		this.con = new AbortController();
		this.token = token;
		this.data = data;
		this.homeserver = /https?:\/\/.+/.test(homeserver) ? homeserver : `https://${homeserver}`;
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
		const ret = (await res.json()) as QueryResponse[T];
		console.log(ret);
		return ret;
	}
}