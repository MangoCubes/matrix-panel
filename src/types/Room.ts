import { EventID, FullUserID, RoomID, UserID } from "./Types";
import { RequireAllOrNone } from "type-fest";

type JoinRule = 'public' | 'knock' | 'invite' | 'private' | 'restricted';

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
	join_rules: JoinRule;
	guest_access: 'can_join' | 'forbidden';
	history_visibility: 'invited' | 'joined' | 'shared' | 'world_readable';
	state_events: number;
	room_type: 'm.space' | null;
}

export type RoomWithState = Room & {states: RoomState[]};

export type Space = Room & {room_type: 'm.space'};

export type ChatRoom = Room & {room_type: null};

type EventBase = {
	event_id: EventID;
	sender: FullUserID;
	origin_server_ts: number;
}

export type Membership = 'invite' | 'knock' | 'join' | 'leave' | 'ban';

type MembershipEventContent = {
	membership: Membership;
	displayname: UserID;
};

type EventContent<T> = {
	content: T;
} & RequireAllOrNone<{
	prev_content: T;
	replaces_state: EventID;
}, 'prev_content' | 'replaces_state'>;

export type SpaceParentEvent = EventBase & EventContent<{
	suggested: boolean;
	via: string[];
}> & {
	type: 'm.space.parent'
	state_key: RoomID; // Parent room ID
}

export type SpaceChildEvent = EventBase & EventContent<{
	suggested: boolean;
	via: string[];
}> & {
	type: 'm.space.child'
	state_key: RoomID; // Child room ID
}

export type MembershipEvent = EventBase & EventContent<MembershipEventContent> & {
	type: 'm.room.member';
	state_key: FullUserID;
}

export type RoomNameEvent = EventBase & EventContent<{
	name: string;
}> & {
	type: 'm.room.name';
	state_key: '';
}

export type RoomJoinRuleEvent = EventBase & EventContent<{
	join_rule: Exclude<JoinRule, 'restricted'>;
} | {
	join_rule: 'restricted';
	allow: {
		type: 'm.room.membership';
		room_id: RoomID;
	}[];
}> & {
	type: 'm.room.join_rules';
	state_key: '';
}

export type RoomState = MembershipEvent | RoomNameEvent | SpaceChildEvent | SpaceParentEvent | RoomJoinRuleEvent;