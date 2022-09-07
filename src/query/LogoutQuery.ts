import { Query, QueryType } from "./Query";

export class LogoutQuery extends Query<QueryType.Logout>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_matrix/client/v3/logout`, {
			method: 'POST',
			body: JSON.stringify({}),
			signal: this.con.signal
		});
	}
}