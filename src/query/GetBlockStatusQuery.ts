import { Query, QueryType } from "./Query";

export class GetBlockStatusQuery extends Query<QueryType.GetBlockStatus>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_synapse/admin/v1/rooms/${this.data.rid}/block`, {
			method: 'GET',
			signal: this.con.signal,
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
		});
	}
}