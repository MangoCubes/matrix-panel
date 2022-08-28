export type Session = {
	connections: Connection[];
}

export type Connection = {
	ip: string;
	last_seen: number;
	user_agent: string;
}