import { Query, QueryType } from "./Query";

export class GetRoomStateQuery extends Query<QueryType.GetRoomState>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_synapse/admin/v1/rooms/${this.data.rid}/state`, {
			method: 'GET',
			signal: this.con.signal,
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
		});
	}
}