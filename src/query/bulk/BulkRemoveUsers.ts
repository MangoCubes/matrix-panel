import { BulkQuery } from "../BulkQuery";
import { QueryType } from "../Query";
import { RemoveUserQuery } from "../RemoveUserQuery";

export class BulkRemoveUsers extends BulkQuery<QueryType.RemoveUser>{
	fetch(): Promise<{}>[] {
		const queries = [];
		for(const u of this.data.uid) queries.push(new RemoveUserQuery(this.homeserver, {
			rid: this.data.rid,
			reason: this.data.reason,
			uid: u,
			ban: this.data.ban
		}, this.token, this.con).send());
		return queries;
	}
}