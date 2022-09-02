import { Query, QueryType } from "./Query";

type Param = {[key: string]: string};

export class GetUsersQuery extends Query<QueryType.GetUsers>{
	parseUrl(){
		const query: Param = {deactivated: 'true'};
		query.guests = this.data.getGuests ? 'true' : 'false';
		if(this.data.offset) query.from = this.data.offset.toString();
		if(this.data.count) query.limit = this.data.count.toString();
		const paramList = [];
		for(const q in query) paramList.push(`${q}=${query[q]}`);
		return `${this.homeserver}/_synapse/admin/v2/users?${paramList.join('&')}`;
	}

	async fetch(): Promise<Response> {
		return await fetch(this.parseUrl(), {
			method: 'GET',
			signal: this.con.signal,
			headers: {
				'Authorization': 'Bearer ' + this.token
			},
		});
	}
}