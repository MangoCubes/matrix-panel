import { Query, QueryType } from "./Query";

export class LoginQuery extends Query<QueryType.Login>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_matrix/client/v3/login`, {
			method: 'POST',
			body: JSON.stringify({
				identifier: {
					type: 'm.id.user',
					user: this.data.uid
				},
				initial_device_display_name: 'Matrix Panel',
				password: this.data.password,
				type: 'm.login.password'
			}),
			signal: this.con.signal
		});
	}
}