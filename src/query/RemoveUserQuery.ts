import { Query, QueryType } from "./Query";

export class RemoveUserQuery extends Query<QueryType.RemoveUser>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_matrix/client/v3/rooms/${this.data.rid}/${this.data.ban ? 'ban' : 'kick'}`, {
			method: 'POST',
			signal: this.con.signal,
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
			body: JSON.stringify({
				user_id: this.data.uid,
				reason: this.data.reason
			})
		});
	}
}