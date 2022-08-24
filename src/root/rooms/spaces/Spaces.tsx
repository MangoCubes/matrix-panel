import { AppBar, Box, CircularProgress, List, Toolbar, Typography } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { BulkGetRoomState } from "../../../query/bulk/BulkGetRoomState";
import { LoginContext } from "../../../storage/LoginInfo";
import { Room, RoomWithState } from "../../../types/Room";
import { RoomID } from "../../../types/Types";
import { SpaceItem } from "./SpaceItem";

export type RoomMap = {[rid: RoomID]: RoomWithState};

export function Spaces(props: {rooms: Room[] | null, reload: () => void}){

	const [roomStates, setRoomStates] = useState<RoomMap | null>(null);

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
			const roomStates: RoomMap = {};
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

	const getRootSpaces = () => {
		const rooms = [];
		for(const k in roomStates){
			const r = roomStates[k as RoomID];
			if(r.states.find(s => s.type === 'm.space.parent')) continue;
			rooms.push(k as RoomID);
		}
		return rooms;
	}

	const getContent = () => {
		if(props.rooms === null) return (
			<Box sx={{flex: 1, flexFlow: 'column'}} display='flex' alignItems='center' justifyContent='center'>
				<CircularProgress/>
				<Typography>{t('spaces.loadingRooms')}</Typography>
			</Box>
		);
		else if(roomStates === null) return (
			<Box sx={{flex: 1, flexFlow: 'column'}} display='flex' alignItems='center' justifyContent='center'>
				<CircularProgress/>
				<Typography>{t('spaces.loadingSpaces')}</Typography>
			</Box>
		);
		else return(
			<Box sx={{flex: 1}}>
				<List>
					{getRootSpaces().map(r => <SpaceItem rid={r} key={r} map={roomStates}/>)}
				</List>
			</Box>
		);
	}

	return (
		<Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
			<AppBar position='static'>
				<Toolbar>
					<Typography variant='h6'>{t('spaces.title')}</Typography>
				</Toolbar>
			</AppBar>
			{getContent()}
		</Box>
	);
}