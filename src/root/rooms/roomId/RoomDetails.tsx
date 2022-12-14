import { AccountTree, Add, History, Info, Lock, NoAccounts, PersonAdd, PrivacyTip, SupervisorAccount, Error as ErrorIcon } from "@mui/icons-material";
import { CardContent, List, ListItem, ListItemIcon, ListItemText, Link, CircularProgress, IconButton } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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

	const nav = useNavigate();

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

	const roomDetails = () => {
		if(props.room.joined_members === 0) return [
			<ListItem key='dead'>
				<ListItemIcon><ErrorIcon/></ListItemIcon>
				<ListItemText primary={t('room.details.dead.name')} secondary={t('room.details.dead.desc')}/>
			</ListItem>
		];
		else return [
			<ListItem key='enc'>
				<ListItemIcon><Lock color={props.room.encryption === null ? 'error' : 'success'}/></ListItemIcon>
				<ListItemText primary={t('room.details.encryption')} secondary={props.room.encryption === null ? t('common.disabled') : `${t('common.enabled')} (${props.room.encryption})`}/>
			</ListItem>,
			<ListItem key='history'>
				<ListItemIcon><History/></ListItemIcon>
				<ListItemText primary={t('room.details.history.name')} secondary={t('room.details.history.' + props.room.history_visibility)}/>
			</ListItem>,
			<ListItem key='joinRule'>
				<ListItemIcon><PersonAdd/></ListItemIcon>
				<ListItemText primary={t('room.details.joinRule.name')} secondary={getJoinRuleText()}/>
			</ListItem>,
			<ListItem key='guest'>
				<ListItemIcon><NoAccounts/></ListItemIcon>
				<ListItemText primary={t('room.details.guest.name')} secondary={t('room.details.guest.' + props.room.guest_access)}/>
			</ListItem>
		]
	}

	return (
		<CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
			<List>
				<ListItem>
					<ListItemIcon><Add/></ListItemIcon>
					<ListItemText primary={t('room.details.creator')} secondary={<Link href='#' onClick={() => nav(`/users/${props.room.creator}`)}>{props.room.creator}</Link>}/>
				</ListItem>
				{roomDetails()}
				<ListItem>
					<ListItemIcon><PrivacyTip/></ListItemIcon>
					<ListItemText primary={t('room.details.version')} secondary={props.room.version}/>
				</ListItem>
				{additionalItems()}
			</List>
		</CardContent>
	);
}