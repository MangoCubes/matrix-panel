import { Query, QueryType } from "./Query";

export class IsAdminQuery extends Query<QueryType.IsAdmin>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_synapse/admin/v1/users/${this.data.uid}/admin`, {
			method: 'GET',
			signal: this.con.signal,
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
		});
	}
}