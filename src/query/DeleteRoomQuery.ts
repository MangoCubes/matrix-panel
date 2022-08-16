import { Query, QueryType } from "./Query";

export class DeleteRoomQuery extends Query<QueryType.DeleteRoom>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_synapse/admin/v2/rooms/${this.data.rid}`, {
			method: 'DELETE',
			body: JSON.stringify({
				purge: true
			}),
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
			signal: this.con.signal
		});
	}
}