import { Refresh } from "@mui/icons-material";
import { Skeleton, Typography, Stack, Box, CardContent, CircularProgress, AppBar, Toolbar, Card, Tabs, Tab, IconButton, Tooltip } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { GetRoomStateQuery } from "../../../query/GetRoomStateQuery";
import { LoginContext } from "../../../storage/LoginInfo";
import { Room, RoomState, RoomWithState } from "../../../types/Room";
import { RoomDetails } from "./RoomDetails";
import { RoomDetailsEdit } from "./RoomDetailsEdit";
import { RoomMembers } from "./RoomMembers";

enum TabName {
	Details = 'details',
	Members = 'members',
	Options = 'options'
}

enum LoadState {
	LoadingRoom,
	LoadingStates,
	Done,
	Invalid
}

type Loading = {
	step: LoadState.LoadingRoom;
} | {
	step: LoadState.LoadingStates;
	room: Room;
	rooms: Room[];
} | {
	step: LoadState.Done;
	room: Room;
	rooms: Room[];
	states: RoomState[];
}

type AllLoadingStates = Loading | {step: LoadState.Invalid};

export function RoomDetailsPage(props: {rooms: Room[] | null, reload: () => void}){

	const [currentTab, setCurrentTab] = useState<TabName>(TabName.Details);
	const [disableTabs, setDisableTabs] = useState<boolean>(false);
	const [currentState, setCurrentState] = useState<AllLoadingStates>({step: LoadState.LoadingRoom});

	const {homeserver, token} = useContext(LoginContext);

	const con = useRef<AbortController | null>(null);

	const {rid} = useParams();

	const getStates = async (roomList: Room[], room: Room) => {
		setCurrentState({step: LoadState.LoadingStates, rooms: roomList, room: room});
		try{
			const req = new GetRoomStateQuery(homeserver, {rid: room.room_id}, token);
			con.current = req.con;
			const res = await req.send();
			setCurrentState({states: res.state, room: room, rooms: roomList, step: LoadState.Done});
		} catch (e) {
			if (e instanceof Error) {
				const msg = handleCommonErrors(e);
				if (msg) toast.error(t(msg));
			}
		}
	}

	const reloadStates = () => {
		setCurrentState({step: LoadState.LoadingRoom});
	}

	useEffect(reloadStates, [rid]);

	useEffect(() => {
		if(!props.rooms) reloadStates();
	}, [props.rooms]);

	useEffect(() => {
		if(props.rooms){
			const r = props.rooms.find(r => r.room_id === rid);
			if(!r) setCurrentState({step: LoadState.Invalid});
			else if (currentState.step === LoadState.LoadingRoom) getStates(props.rooms, r);
		}
	}, [currentState, props.rooms]);

	const {t} = useTranslation();

	const nav = useNavigate();

	const getTitle = (l: Loading) => {
		if(l.step === LoadState.LoadingRoom) return <Skeleton sx={{width: '40%'}}/>;
		else return <Typography variant='h6'>{t('room.title', {name: l.room.room_id})}</Typography>
	}

	const getRoomDetails = (l: Loading) => {
		if(l.step === LoadState.LoadingRoom) return (
			<Stack direction='row' spacing={2}>
				<Box>
					<Typography variant='h5' sx={{width: '128px'}}><Skeleton/></Typography>
					<Typography variant='h6' sx={{width: '128px'}}><Skeleton/></Typography>
					<Typography variant='caption' sx={{width: '128px'}}><Skeleton/></Typography>
				</Box>
			</Stack>
		)
		const r = l.room;
		return (
		<Stack direction='row' spacing={2}>
			<Box key='name'>
				{r.name && r.name !== '' ? <Typography variant='h5'>{r.name}</Typography> : <Typography variant='h5' color='GrayText'>{t('room.noName')}</Typography>}
				{r.canonical_alias && r.canonical_alias !== '' ? <Typography variant='h6'>{r.canonical_alias}</Typography> : <Typography variant='h6' color='GrayText'>{t('room.noAlias')}</Typography>}
				<Typography variant='caption' color='GrayText'>{r.room_id}</Typography>
			</Box>
		</Stack>
		);
	}

	const getCurrentContent = (l: Loading) => {
		const loading = (
			<CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
				<Box width='100%' textAlign='center'>
					<CircularProgress/>
				</Box>
			</CardContent>
		)
		if(l.step === LoadState.LoadingRoom) return loading;
		if(currentTab === TabName.Details) return <RoomDetails allRooms={l.rooms} room={l.room} states={l.step === LoadState.Done ? l.states : null} disableTabs={setDisableTabs}/>;
		if(l.step === LoadState.LoadingStates) return loading;
		const room: RoomWithState = {
			...l.room,
			states: l.states
		};
		if(currentTab === TabName.Options) return <RoomDetailsEdit reload={reloadStates} room={room} disableTabs={setDisableTabs}/>;
		else if(currentTab === TabName.Members) {
			const states = [];
			for(const s of l.states) if(s.type === 'm.room.member') states.push(s);
			return <RoomMembers room={l.room} states={states} reload={reloadStates}/>;
		}
		else return <Box sx={{flex: 1}}></Box>;
	}

	const returnToRooms = () => {
		toast.error(t('room.invalidRoom'));
		nav('../');
	}

	if(currentState.step === LoadState.Invalid) return <>{returnToRooms()}</>;
	else return (
	<Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
		<AppBar position='static'>
			<Toolbar>
				{getTitle(currentState)}
				<Box sx={{flex: 1}}/>
				<Tooltip title={t('common.reload')}>
					<span>
						<IconButton edge='end' onClick={props.reload} disabled={props.rooms === null || currentState.step !== LoadState.Done}>
							<Refresh/>
						</IconButton>
					</span>
				</Tooltip>
			</Toolbar>
		</AppBar>
		<Box m={2} sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
			<Card>
				<CardContent>
					{getRoomDetails(currentState)}
				</CardContent>
			</Card>
			<Card sx={{mt: 2, flex: 1, display: 'flex', flexDirection: 'column'}}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs value={currentTab} onChange={(e, s) => setCurrentTab(s)}>
						<Tab disabled={disableTabs || props.rooms === null} value={TabName.Details} label={t('room.details.title')}/>
						<Tab disabled={disableTabs || props.rooms === null} value={TabName.Options} label={t('room.options.title')}/>
						<Tab disabled={disableTabs || props.rooms === null} value={TabName.Members} label={t('room.members.title')}/>
					</Tabs>
				</Box>
				{getCurrentContent(currentState)}
			</Card>
		</Box>
	</Box>
	);
}