import { RoomState } from "../../types/Room";
import { BulkQuery } from "../BulkQuery";
import { GetRoomStateQuery } from "../GetRoomStateQuery";
import { QueryType } from "../Query";

export class BulkGetRoomState extends BulkQuery<QueryType.GetRoomState>{
	fetch(): Promise<{state: RoomState[]}>[] {
		const queries = [];
		for(const r of this.data.rooms) queries.push(new GetRoomStateQuery(this.homeserver, {rid: r}, this.token, this.con).send());
		return queries;
	}
}