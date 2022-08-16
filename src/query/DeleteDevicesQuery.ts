import { Query, QueryType } from "./Query";

export class DeleteDevicesQuery extends Query<QueryType.DeleteDevices>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_synapse/admin/v2/users/${this.data.uid}/delete_devices`, {
			method: 'POST',
			body: JSON.stringify({
				devices: this.data.devices
			}),
			signal: this.con.signal
		});
	}
}