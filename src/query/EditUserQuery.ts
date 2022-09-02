import { Query, QueryType } from "./Query";

export class EditUserQuery extends Query<QueryType.EditUser>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_synapse/admin/v2/users/${this.data.uid}`, {
			method: 'POST',
			signal: this.con.signal,
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
			body: JSON.stringify(this.data.data)
		});
	}
}