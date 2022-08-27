import { AccountTree, Add, History, Info, Lock, PersonAdd, SupervisorAccount } from "@mui/icons-material";
import { CardContent, CardActions, Button, List, ListItem, ListItemIcon, ListItemText, Link, CircularProgress, IconButton } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { DeleteRoomQuery } from "../../../query/DeleteRoomQuery";
import { LoginContext } from "../../../storage/LoginInfo";
import { Room, RoomState } from "../../../types/Room";
import { ChildrenDialog } from "./ChildrenDialog";

function RoomChildren(props: {parent: Room, children: Room[]}){

	const [open, setOpen] = useState(false);

	const {t} = useTranslation();

	return (
		<>
		<ChildrenDialog open={open} parent={props.parent} children={props.children} close={() => setOpen(false)}/>
		<ListItem secondaryAction={
			<IconButton onClick={() => setOpen(true)}>
				<Info/>
			</IconButton>
		}>
			<ListItemIcon><AccountTree/></ListItemIcon>
			<ListItemText primary={t('room.details.children.value', {count: props.children.length})} secondary={t('room.details.children.name')}/>
		</ListItem>
		</>
	)
}

export function RoomDetails(props: {allRooms: Room[], room: Room, states: RoomState[] | null, disableTabs: (to: boolean) => void}) {

	const {t} = useTranslation();

	const {homeserver, token} = useContext(LoginContext);

	const [querying, setQuerying] = useState<boolean>(false);

	const nav = useNavigate();

	const deleteRoom = async () => {
		setQuerying(true);
		try{
			const req = new DeleteRoomQuery(homeserver, {rid: props.room.room_id}, token);
			await req.send();
			toast.success(t('room.details.deleteSuccess', {rid: props.room.room_id}));
			nav('../');
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
		} finally {
			setQuerying(false);
		}
	}

	const additionalItems = () => {
		if(props.states === null) return (
			<ListItem key='loading'>
				<CircularProgress/>
			</ListItem>
		);
		const items = [];
		const parent = props.states.find(s => s.type === 'm.space.parent');
		const childrenStates = props.states.filter(s => s.type === 'm.space.child');
		const childrenRooms = [];
		for(const c of childrenStates){
			const room = props.allRooms.find(r => r.room_id === c.state_key);
			if(room){
				childrenRooms.push(room);
				continue;
			}
		}
		if (parent) items.push (
			<ListItem key='parent'>
				<ListItemIcon><SupervisorAccount/></ListItemIcon>
				<ListItemText primary={<Link href='#' onClick={() => nav(`/rooms/${parent.state_key}`)}>{parent.state_key}</Link>} secondary={t('room.details.parent')}/>
			</ListItem>
		);
		if(childrenRooms.length !== 0) items.push(<RoomChildren key='children' parent={props.room} children={childrenRooms}/>);
		return items;
	}

	useEffect(() => {
		props.disableTabs(querying);
	}, [querying]);

	return (
		<>
		<CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
			<List>
				<ListItem>
					<ListItemIcon><Add/></ListItemIcon>
					<ListItemText primary={<Link href='#' onClick={() => nav(`/users/${props.room.creator}`)}>{props.room.creator}</Link>} secondary={t('room.details.creator')}/>
				</ListItem>
				<ListItem>
					<ListItemIcon><Lock color={props.room.encryption === null ? 'error' : 'success'}/></ListItemIcon>
					<ListItemText primary={props.room.encryption === null ? t('common.disabled') : `${t('common.enabled')} (${props.room.encryption})`} secondary={t('room.details.encryption')}/>
				</ListItem>
				<ListItem>
					<ListItemIcon><History/></ListItemIcon>
					<ListItemText primary={t('room.details.history.' + props.room.history_visibility)} secondary={t('room.details.history.name')}/>
				</ListItem>
				<ListItem>
					<ListItemIcon><PersonAdd/></ListItemIcon>
					<ListItemText primary={t('room.details.joinRule.' + props.room.join_rules)} secondary={t('room.details.joinRule.name')}/>
				</ListItem>
				{additionalItems()}
			</List>
		</CardContent>
		<CardActions>
			<Button sx={{ml: 'auto'}} color='error' disabled={querying} onClick={() => deleteRoom()}>{t('room.details.delete')}</Button>
		</CardActions>
		</>
	);
}