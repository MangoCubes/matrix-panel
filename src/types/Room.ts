import { UserID } from "matrix-bot-sdk";
import { EventID, FullUserID, RoomID } from "./Types";

export type Room = {
	room_id: RoomID;
	name: string;
	canonical_alias: string | null;
	joined_members: number;
	joined_local_members: number;
	version: string;
	creator: FullUserID;
	encryption: string | null;
	federatable: boolean;
	public: boolean;
	join_rules: 'public' | 'knock' | 'invite' | 'private';
	guest_access: 'can_join' | 'forbidden';
	history_visibility: 'invited' | 'joined' | 'shared' | 'world_readable';
	state_events: number;
	room_type: 'm.space' | null;
}

type EventBase = {
	event_id: EventID;
	sender: FullUserID;
	origin_server_ts: number;
}

export type RoomMemberState = EventBase & {
	type: 'm.room.member';
	state_key: FullUserID;
	content: {
		membership: 'invite' | 'knock' | 'join' | 'leave' | 'ban';
		displayname: UserID;
	};
}

export type RoomState = RoomMemberState;