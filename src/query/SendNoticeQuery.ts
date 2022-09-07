import { Query, QueryType } from "./Query";

export class SendNoticeQuery extends Query<QueryType.SendNotice>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_synapse/admin/v1/send_server_notice`, {
			method: 'POST',
			signal: this.con.signal,
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
			body: JSON.stringify({
				user_id: this.data.uid,
				content: {
					msgtype: 'm.text',
					body: this.data.message
				}
			})
		});
	}
}