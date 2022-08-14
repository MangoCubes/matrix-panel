import { HTTPError } from "../class/error/HTTPError";
import { Room } from "../types/Room";
import { AccessToken, DeviceID, FullUserID, UserID } from "../types/Types";
import { User } from "../types/User";

export enum QueryType{
	IsAdmin,
	Login,
	GetRooms,
	GetUsers,
	Deactivate,
	ToggleAdmin
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
	[QueryType.GetRooms]: {
		rooms: Room[];
		offset: number;
		total_rooms: number;
	};
	[QueryType.GetUsers]: {
		users: User[];
		next_token: number;
		total: number;
	};
	[QueryType.Deactivate]: {};
	[QueryType.ToggleAdmin]: {};
}

export type NeedToken<T extends QueryType> = T extends Exclude<QueryType, QueryType.Login> ? AccessToken : null;

export type QueryParams = {
	[QueryType.Login]: {
		uid: UserID;
		password: string;
	};
	[QueryType.IsAdmin]: {
		uid: FullUserID;
	};
	[QueryType.GetRooms]: {
		offset?: number;
		filter?: string;
	};
	[QueryType.GetUsers]: {
		offset?: number;
		getGuests?: boolean;
		count?: number;
	};
	[QueryType.Deactivate]: {
		user: FullUserID;
	};
	[QueryType.ToggleAdmin]: {
		user: FullUserID;
		to: boolean;
	};
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