import { Query, QueryType } from "./Query";

export class PurgeHistoryQuery extends Query<QueryType.PurgeHistory>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_synapse/admin/v1/purge_history/${this.data.rid}`, {
			method: 'POST',
			signal: this.con.signal,
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
			body: JSON.stringify({
				delete_local_events: this.data.local,
				purge_up_to_ts: this.data.ts
			})
		});
	}
}