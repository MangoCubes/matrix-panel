import { Query, QueryType } from "./Query";

export class SetUserRoomAdminQuery extends Query<QueryType.SetUserRoomAdmin>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_synapse/admin/v1/rooms/${this.data.rid}/make_room_admin`, {
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