import { Query, QueryType } from "./Query";

export type EditUserQueryData = {
	password?: string;
	logout?: boolean;
	displayname?: string;
	avatar_url?: string;
	admin?: boolean;
	deactivated?: boolean;
	user_type?: null | 'bot' | 'support';
};

export class EditUserQuery extends Query<QueryType.EditUser>{
	async fetch(): Promise<Response> {
		return await fetch(`${this.homeserver}/_synapse/admin/v2/users/${this.data.uid}`, {
			method: 'PUT',
			signal: this.con.signal,
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
			body: JSON.stringify(this.data.data)
		});
	}
}