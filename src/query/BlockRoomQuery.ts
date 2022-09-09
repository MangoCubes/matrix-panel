import { Query, QueryType } from "./Query";

export class BlockRoomQuery extends Query<QueryType.BlockRoom>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_synapse/admin/v1/rooms/${this.data.rid}/block`, {
			method: 'PUT',
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
			signal: this.con.signal,
			body: JSON.stringify({
				block: this.data.block
			})
		});
	}
}