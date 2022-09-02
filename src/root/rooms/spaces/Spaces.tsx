import { Refresh } from "@mui/icons-material";
import { AppBar, Box, CircularProgress, IconButton, List, Toolbar, Typography } from "@mui/material";
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
			const roomsId = rooms.map(r => r.room_id);
			const req = new BulkGetRoomState(homeserver, {rooms: roomsId}, token);
			con.current = req.con;
			const res = await req.send();
			const roomStates: RoomMap = {};
			for(let i = 0; i < rooms.length; i++) {
				const s = res[i];
				if(s instanceof Error) continue;
				else {
					roomStates[rooms[i].room_id] = {
						...rooms[i],
						states: s.state
					};
				}
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
			if(r.room_type === 'm.space') rooms.push(k as RoomID);
		}
		return rooms;
	}

	const getList = (roomStates: RoomMap) => {
		const list = getRootSpaces();
		if(list.length === 0) return (
			<Box sx={{flex: 1, flexFlow: 'column'}} display='flex' alignItems='center' justifyContent='center'>
				<Typography>{t('spaces.noSpace')}</Typography>
				<IconButton onClick={() => props.reload()}>
					<Refresh/>
				</IconButton>
			</Box>
		);
		else return (
			<Box sx={{flex: 1}}>
				<List>
					{list.map(r => <SpaceItem rid={r} key={r} map={roomStates} level={0}/>)}
				</List>
			</Box>
		)
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
		else return getList(roomStates);
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