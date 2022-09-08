import { Query, QueryType } from "./Query";

export class GetServerVersionQuery extends Query<QueryType.GetServerVersion>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_matrix/federation/v1/version`, {
			method: 'GET',
			signal: this.con.signal,
		});
	}
}