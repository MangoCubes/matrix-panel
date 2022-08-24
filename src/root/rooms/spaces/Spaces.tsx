import { List } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { BulkGetRoomState } from "../../../query/bulk/BulkGetRoomState";
import { GetRoomsQuery } from "../../../query/GetRoomsQuery";
import { LoginContext } from "../../../storage/LoginInfo";
import { RoomWithState } from "../../../types/Room";
import { RoomID } from "../../../types/Types";

export function Spaces(){

	const [reload, setReload] = useState(true);
	const [roomStates, setRoomStates] = useState<{[rid: RoomID]: RoomWithState} | null>(null);

	const con = useRef<AbortController | null>(null);

	const {t} = useTranslation();

	const {homeserver, token} = useContext(LoginContext);

	const getStates = async () => {
		setRoomStates(null);
		setReload(false);
		try{
			const roomReq = new GetRoomsQuery(homeserver, {}, token);
			con.current = roomReq.con;
			const roomRes = await roomReq.send();
			const spaces = roomRes.rooms.filter(r => r.room_type === 'm.space').map(r => r.room_id);
			const req = new BulkGetRoomState(homeserver, {rooms: spaces}, token);
			con.current = req.con;
			const res = await req.send();
			const roomStates: {[rid: RoomID]: RoomWithState} = {};
			for(let i = 0; i < spaces.length; i++) {
				if(res[i] === null) continue;
				roomStates[spaces[i]] = {
					...roomRes.rooms[i],
					states: res[i]!.state
				};
			}
			setRoomStates(roomStates);
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
		}
	}

	useEffect(() => {
		if(reload) getStates();
	}, [reload]);

	useEffect(() => {
		return () => {
			if(con.current) con.current.abort();
		}
	}, []);

	return (
	<List>
		
	</List>
	);
}