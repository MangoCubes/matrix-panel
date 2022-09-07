import { HTTPError } from "../class/error/HTTPError";
import { Device } from "../types/Device";
import { Room, RoomState } from "../types/Room";
import { Session } from "../types/Session";
import { AccessToken, DeviceID, FullUserID, RoomID, UserID } from "../types/Types";
import { User } from "../types/User";
import { EditUserQueryData } from "./EditUserQuery";

export enum QueryType{
	IsAdmin,
	Login,
	GetRooms,
	GetUsers,
	Deactivate,
	ToggleAdmin,
	GetUserDevices,
	DeleteDevices,
	DeleteRoom,
	GetRoomState,
	GetSessions,
	SetUserRoomAdmin,
	SetUserMembership,
	JoinRoom,
	RemoveUser,
	SetAlias,
	SetCanonicalAlias,
	EditUser,
	GetUserMembership,
	PurgeHistory,
	GenerateUserToken,
	Logout
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
	[QueryType.GetUserDevices]: {
		devices: Device[];
		total: number;
	};
	[QueryType.DeleteDevices]: {};
	[QueryType.DeleteRoom]: {
		delete_id: string;
	};
	[QueryType.GetRoomState]: {
		state: RoomState[];
	};
	[QueryType.GetSessions]: {
		user_id: FullUserID;
		devices: {
			'': {
				sessions: [Session];
			}
		}
	};
	[QueryType.SetUserRoomAdmin]: {};
	[QueryType.SetUserMembership]: {
		room_id: RoomID;
	};
	[QueryType.JoinRoom]: {
		room_id: RoomID;
	};
	[QueryType.RemoveUser]: {};
	[QueryType.SetAlias]: {};
	[QueryType.SetCanonicalAlias]: {};
	[QueryType.EditUser]: {};
	[QueryType.GetUserMembership]: {
		joined_rooms: RoomID[];
		total: number;
	};
	[QueryType.PurgeHistory]: {
		purge_id: string;
	};
	[QueryType.GenerateUserToken]: {
		access_token: string;
	};
	[QueryType.Logout]: {};
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
	[QueryType.GetUserDevices]: {
		uid: FullUserID;
	};
	[QueryType.DeleteDevices]: {
		uid: FullUserID;
		devices: DeviceID[];
	};
	[QueryType.DeleteRoom]: {
		rid: RoomID;
	};
	[QueryType.GetRoomState]: {
		rid: RoomID;
	};
	[QueryType.GetSessions]: {
		uid: FullUserID;
	};
	[QueryType.SetUserRoomAdmin]: {
		uid: FullUserID;
		rid: RoomID;
	};
	[QueryType.SetUserMembership]: {
		uid: FullUserID;
		rid: RoomID;
	};
	[QueryType.JoinRoom]: {
		rid: RoomID;
	};
	[QueryType.RemoveUser]: {
		rid: RoomID;
		uid: FullUserID;
		reason?: string;
		ban: boolean;
	};
	[QueryType.SetAlias]: {
		rid: RoomID;
		alias: string;
	};
	[QueryType.SetCanonicalAlias]: {
		rid: RoomID;
		alias: string;
	};
	[QueryType.EditUser]: {
		uid: FullUserID;
		data: EditUserQueryData;
	};
	[QueryType.GetUserMembership]: {
		uid: FullUserID;
	};
	[QueryType.PurgeHistory]: {
		rid: RoomID;
		local: boolean;
		ts: number;
	};
	[QueryType.GenerateUserToken]: {
		valid_until_ms?: number;
		uid: FullUserID;
	};
	[QueryType.Logout]: {};
}

export abstract class Query<T extends QueryType>{

	con: AbortController;
	token: NeedToken<T>;
	data: QueryParams[T];
	homeserver: string;

	constructor(homeserver: string, data: QueryParams[T], token: NeedToken<T>, con?: AbortController){
		this.con = con ? con : new AbortController();
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
		const ret = (await res.json()) as QueryResponse[T];
		if(res.status < 200 || res.status > 299) throw new HTTPError(res.status);
		console.log(ret);
		return ret;
	}
}