import { Query, QueryType } from "./Query";
export class SetCanonicalAliasQuery extends Query<QueryType.SetCanonicalAlias>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_matrix/client/v3/rooms/${this.data.rid}/state/m.room.canonical_alias`, {
			method: 'PUT',
			signal: this.con.signal,
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
			body: JSON.stringify({
				alt_aliases: [],
				alias: this.data.alias
			})
		});
	}
}