import { Query, QueryType } from "./Query";

export class GetSessionsQuery extends Query<QueryType.GetSessions>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_matrix/client/r0/admin/whois/${this.data.uid}`, {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
			signal: this.con.signal
		});
	}
}