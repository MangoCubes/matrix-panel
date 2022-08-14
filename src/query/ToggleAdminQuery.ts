import { Query, QueryType } from "./Query";

export class ToggleAdminQuery extends Query<QueryType.ToggleAdmin>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_synapse/admin/v1/users/${this.data.user}/admin`, {
			method: 'PUT',
			signal: this.con.signal,
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
			body: JSON.stringify({
				admin: this.data.to
			})
		});
	}
}