import { Query, QueryType } from "./Query";

export class GenerateUserTokenQuery extends Query<QueryType.GenerateUserToken>{
	async fetch(): Promise<Response> {
		const body: {
			valid_until_ms?: number;
		} = {};
		if(this.data.valid_until_ms) body.valid_until_ms = this.data.valid_until_ms;
		return await fetch(`${this.homeserver}/_synapse/admin/v1/users/${this.data.uid}/login`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
			signal: this.con.signal
		});
	}
}