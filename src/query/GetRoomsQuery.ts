import { Query, QueryType } from "./Query";

type Param = {[key: string]: string};

export class GetRoomsQuery extends Query<QueryType.GetRooms>{

	parseUrl(){
		const query: Param = {};
		if(this.data.filter) query.search_term = this.data.filter;
		if(this.data.offset) query.from = this.data.offset.toString();
		if (Object.keys(query).length === 0) return `${this.homeserver}/_synapse/admin/v1/rooms`;
		else {
			const paramList = [];
			for(const q in query) paramList.push(`${q}=${query[q]}`);
			return `${this.homeserver}/_synapse/admin/v1/rooms?${paramList.join('&')}`;
		}
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