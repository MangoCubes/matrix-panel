import { BulkQuery } from "../BulkQuery";
import { DeleteRoomQuery } from "../DeleteRoomQuery";
import { QueryType } from "../Query";

export class BulkDeleteRooms extends BulkQuery<QueryType.DeleteRoom>{
	fetch(): Promise<{delete_id: string}>[] {
		const queries = [];
		for(const r of this.data.rooms) queries.push(new DeleteRoomQuery(this.homeserver, {rid: r}, this.token, this.con).send());
		return queries;
	}

}