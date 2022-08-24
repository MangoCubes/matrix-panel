import { AppBar, Box, List, Toolbar } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { BulkGetRoomState } from "../../../query/bulk/BulkGetRoomState";
import { LoginContext } from "../../../storage/LoginInfo";
import { Room, RoomWithState } from "../../../types/Room";
import { RoomID } from "../../../types/Types";

export function Spaces(props: {rooms: Room[] | null, reload: () => void}){

	const [roomStates, setRoomStates] = useState<{[rid: RoomID]: RoomWithState} | null>(null);

	const con = useRef<AbortController | null>(null);

	const {t} = useTranslation();

	const {homeserver, token} = useContext(LoginContext);

	const getStates = async (rooms: Room[]) => {
		setRoomStates(null);
		try{
			const spaces = rooms.filter(r => r.room_type === 'm.space');
			const spacesId = spaces.map(r => r.room_id);
			const req = new BulkGetRoomState(homeserver, {rooms: spacesId}, token);
			con.current = req.con;
			const res = await req.send();
			const roomStates: {[rid: RoomID]: RoomWithState} = {};
			for(let i = 0; i < spaces.length; i++) {
				if(res[i] === null) continue;
				roomStates[spaces[i].room_id] = {
					...spaces[i],
					states: res[i]!.state
				};
			}
			setRoomStates(roomStates);
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
		}
	}

	useEffect(() => {
		if(props.rooms) getStates(props.rooms);
		else setRoomStates(null);
	}, [props.rooms]);

	useEffect(() => {
		return () => {
			if(con.current) con.current.abort();
		}
	}, []);

	return (
		<Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
			<AppBar position='static'>
				<Toolbar>
					{t('spaces.title')}
				</Toolbar>
			</AppBar>
			<List>
			
			</List>
		</Box>

	);
}