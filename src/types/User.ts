import { FullUserID } from "./Types"

export type User = {
	name: FullUserID;
	is_guest: 0 | 1;
	admin: 0 | 1;
	user_type: null;
	deactivated: 0 | 1;
	shadow_banned: 0 | 1;
	displayname: string;
	avatar_url: string;
	creation_ts: number
}