import { Query, QueryType } from "./Query";

export class SetUserMembershipQuery extends Query<QueryType.SetUserMembership>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_synapse/admin/v1/join/${this.data.rid}`, {
			method: 'POST',
			signal: this.con.signal,
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
			body: JSON.stringify({
				user_id: this.data.uid
			})
		});
	}
}