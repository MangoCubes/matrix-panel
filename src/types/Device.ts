import { FullUserID } from "./Types";

export type Device = {
	device_id: string;
	display_name: string | null;
	last_seen_ip: string;
	last_seen_ts: number;
	user_id: FullUserID;
}