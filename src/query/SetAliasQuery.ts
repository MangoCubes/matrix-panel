import { Query, QueryType } from "./Query";

export class SetAliasQuery extends Query<QueryType.SetAlias>{
	async fetch(): Promise<Response> {
		console.log(`${this.homeserver}/_matrix/client/v3/directory/room/${this.data.alias}`)
		return await fetch(`${this.homeserver}/_matrix/client/v3/directory/room/${this.data.alias}`, {
			method: 'PUT',
			signal: this.con.signal,
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
			body: JSON.stringify({
				room_id: this.data.rid
			})
		});
	}
}