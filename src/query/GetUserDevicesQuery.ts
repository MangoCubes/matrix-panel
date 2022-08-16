import { Query, QueryType } from "./Query";

export class GetUserDevicesQuery extends Query<QueryType.GetUserDevices>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_synapse/admin/v2/users/${this.data.uid}/devices`, {
			method: 'GET',
			signal: this.con.signal,
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
		});
	}
}