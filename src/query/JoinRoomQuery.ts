import { Query, QueryType } from "./Query";

export class JoinRoomQuery extends Query<QueryType.JoinRoom>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_matrix/client/v3/rooms/${this.data.rid}/join`, {
			method: 'POST',
			signal: this.con.signal,
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
			body: JSON.stringify({})
		});
	}
}