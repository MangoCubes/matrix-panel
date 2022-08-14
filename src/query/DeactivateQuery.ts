import { Query, QueryType } from "./Query";

export class DeactivateQuery extends Query<QueryType.Deactivate>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_synapse/admin/v1/deactivate/${this.data.user}`, {
			method: 'POST',
			signal: this.con.signal,
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
			body: JSON.stringify({
				erase: true
			})
		});
	}
}