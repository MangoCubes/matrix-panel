import { Query, QueryType } from "./Query";

export class GetUserMembershipQuery extends Query<QueryType.GetUserMembership>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_synapse/admin/v1/users/${this.data.uid}/joined_rooms`, {
			method: 'GET',
			signal: this.con.signal,
			headers: {
				'Authorization': 'Bearer ' + this.token
			}
		});
	}
}