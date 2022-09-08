import { AccountTree, Add, History, Info, Lock, NoAccounts, PersonAdd, PrivacyTip, SupervisorAccount } from "@mui/icons-material";
import { CardContent, CardActions, Button, List, ListItem, ListItemIcon, ListItemText, Link, CircularProgress, IconButton } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { DeleteRoomQuery } from "../../../query/DeleteRoomQuery";
import { LoginContext } from "../../../storage/LoginInfo";
import { Room, RoomJoinRuleEvent, RoomState } from "../../../types/Room";
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
			<ListItemText primary={t('room.details.children.name')} secondary={t('room.details.children.value', {count: props.children.length})}/>
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
				<ListItemText primary={t('room.details.parent')} secondary={<Link href='#' onClick={() => nav(`/rooms/${parent.state_key}`)}>{parent.state_key}</Link>}/>
			</ListItem>
		);
		if(childrenRooms.length !== 0) items.push(<RoomChildren key='children' parent={props.room} children={childrenRooms}/>);
		return items;
	}

	useEffect(() => {
		props.disableTabs(querying);
	}, [querying]);

	const getJoinRuleText = () => {
		const rule = t('room.details.joinRule.' + props.room.join_rules);
		if(props.states === null) return rule;
		if(props.room.join_rules === 'restricted'){
			const e = props.states.find(s => s.type === 'm.room.join_rules');
			if(!e) return rule;
			else {
				const joinEvent = e as RoomJoinRuleEvent;
				if(joinEvent.content.join_rule !== 'restricted') return rule;
				else {
					const allowedRooms = joinEvent.content.allow.map(e => e.room_id);
					return `${rule} (${t('room.details.joinRule.mustBeMemberOf', {roomId: allowedRooms.join(', ')})})`;
				}
			}
		} else return rule;
	}

	return (
		<>
		<CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
			<List>
				<ListItem>
					<ListItemIcon><Add/></ListItemIcon>
					<ListItemText primary={t('room.details.creator')} secondary={<Link href='#' onClick={() => nav(`/users/${props.room.creator}`)}>{props.room.creator}</Link>}/>
				</ListItem>
				<ListItem>
					<ListItemIcon><Lock color={props.room.encryption === null ? 'error' : 'success'}/></ListItemIcon>
					<ListItemText primary={t('room.details.encryption')} secondary={props.room.encryption === null ? t('common.disabled') : `${t('common.enabled')} (${props.room.encryption})`}/>
				</ListItem>
				<ListItem>
					<ListItemIcon><History/></ListItemIcon>
					<ListItemText primary={t('room.details.history.name')} secondary={t('room.details.history.' + props.room.history_visibility)}/>
				</ListItem>
				<ListItem>
					<ListItemIcon><PersonAdd/></ListItemIcon>
					<ListItemText primary={t('room.details.joinRule.name')} secondary={getJoinRuleText()}/>
				</ListItem>
				<ListItem>
					<ListItemIcon><NoAccounts/></ListItemIcon>
					<ListItemText primary={t('room.details.guest.name')} secondary={t('room.details.guest.' + props.room.guest_access)}/>
				</ListItem>
				<ListItem>
					<ListItemIcon><PrivacyTip/></ListItemIcon>
					<ListItemText primary={t('room.details.version')} secondary={props.room.version}/>
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