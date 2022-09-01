import { AdminPanelSettings, Edit, Mail, PersonAdd, PersonOff, Tag } from "@mui/icons-material";
import { Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, List, ListItem, ListItemIcon, ListItemText, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { HTTPError } from "../../../class/error/HTTPError";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { JoinRoomQuery } from "../../../query/JoinRoomQuery";
import { Query, QueryType } from "../../../query/Query";
import { SetAliasQuery } from "../../../query/SetAliasQuery";
import { SetUserRoomAdminQuery } from "../../../query/SetUserRoomAdminQuery";
import { LoginContext } from "../../../storage/LoginInfo";
import { MembershipEvent, RoomWithState } from "../../../types/Room";

export function RoomDetailsEdit(props: {room: RoomWithState, reload: () => void, disableTabs: (to: boolean) => void}){

	const {t} = useTranslation();

	const [open, setOpen] = useState<boolean>(false);

	const {homeserver, token, uid} = useContext(LoginContext);

	const [querying, setQuerying] = useState<boolean>(false);

	useEffect(() => {
		props.disableTabs(querying);
	}, [querying]);

	const joinRoom = async () => {
		await sendQuery(true, new JoinRoomQuery(homeserver, {rid: props.room.room_id}, token), t('room.options.join.success'));
	}

	const setRoomAdmin = async (isInvite: boolean) => {
		await sendQuery(true, new SetUserRoomAdminQuery(homeserver, {rid: props.room.room_id, uid: uid}, token), isInvite ? t('room.options.join.success') : t('room.options.admin.success'));
	}

	const sendQuery = async (reload: boolean, query: Query<QueryType>, success: string) => {
		setQuerying(true);
		try{
			await query.send();
			toast.success(success);
			if(reload)props.reload();
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
		} finally {
			setQuerying(false);
		}
	}

	const getJoinAction = () => {
		let title = t(`room.options.request.name`);
		let desc = t(`room.options.request.desc`);
		let action = () => setRoomAdmin(true);
		let icon = <Mail/>;
		const membership = props.room.states.find(s => s.type === 'm.room.member' && s.state_key === uid);
		if(membership){
			const m = membership as MembershipEvent;
			if(m.content.membership === 'join'){ //Already member
				title = t(`room.options.admin.name`);
				desc = t('room.options.admin.desc');
				action = () => setRoomAdmin(false);
				icon = <AdminPanelSettings/>;
			} else if(m.content.membership === 'invite'){ //Invited
				title = t(`room.options.join.name`);
				desc = t('room.options.join.desc');
				action = joinRoom;
				icon = <PersonAdd/>;
			}
		} //Not invited
		
		return (
			<ListItem secondaryAction={
				<Button onClick={action} disabled={querying}>{t('common.confirm')}</Button>
			}>
				<ListItemIcon>
					{icon}
				</ListItemIcon>
				<ListItemText primary={title} secondary={desc}/>
			</ListItem>
		)
	}

	const getActions = () => {
		const membership = props.room.states.find(s => s.type === 'm.room.member' && s.state_key === uid && s.content.membership === 'join');
		if(membership){
			return [
				<ListItem key='alias' secondaryAction={
					<IconButton edge='end' onClick={() => setOpen(true)}>
						<Edit/>
					</IconButton>
				}>
					<ListItemIcon>
						<Tag/>	
					</ListItemIcon>
					<ListItemText primary={t(`room.options.alias.name${props.room.canonical_alias === null ? 'Unset' : ''}`)} secondary={t('room.options.alias.desc')}/>
					<AliasDialog room={props.room} open={open} close={() => setOpen(false)} reload={props.reload}/>
				</ListItem>
			];
		} else {
			return [
				<ListItem key='notMember'>
					<ListItemIcon>
						<PersonOff/>	
					</ListItemIcon>
					<ListItemText primary={t(`room.options.notMember.name`)} secondary={t('room.options.notMember.desc')}/>
				</ListItem>
			];
		}
	}

	return (
		<CardContent>
			<List>
				{getJoinAction()}
				{getActions()}
			</List>
		</CardContent>
	)
}

function AliasDialog(props: {room: RoomWithState, open: boolean, close: () => void, reload: () => void}){

	const {t} = useTranslation();

	const [alias, setAlias] = useState<string>('');
	const [querying, setQuerying] = useState<boolean>(false);

	const {homeserver, token} = useContext(LoginContext);

	const sendAlias = async () => {
		let fullAlias;
		if(!alias.includes(':')) {
			toast.error(t('room.options.alias.missingServerName'));
			return;
		}
		if(alias.startsWith('#')) fullAlias = alias;
		else fullAlias = '#' + alias;
		setQuerying(true);
		try{
			const req = new SetAliasQuery(homeserver, {rid: props.room.room_id, alias: encodeURIComponent(fullAlias)}, token);
			await req.send();
			toast.success(t('room.options.alias.success', {rid: props.room.room_id, alias: fullAlias}));
			props.reload();
		} catch (e) {
			const locallyHandled = [409];
			if (e instanceof Error) {
				if(e instanceof HTTPError && locallyHandled.includes(e.errCode)){
					if(e.errCode === 409) toast.error(t('room.options.alias.duplicate', {alias: fullAlias}));
					return;
				}
				handleCommonErrors(e, t);
			}
		} finally {
			setQuerying(false);
		}
	}

	const close = () => {
		if(!querying) props.close();
	}

	return (
		<Dialog open={props.open} onClose={close}>
			<DialogTitle>{t('room.options.alias.setNewAlias')}</DialogTitle>
			<DialogContent>
				<TextField
					variant='standard'
					value={alias}
					disabled={querying}
					onChange={(e) => setAlias(e.currentTarget.value)}
					label={t('room.options.alias.newAlias')}
					InputProps={{
						startAdornment: <InputAdornment position='start'>#</InputAdornment>
					}}
				/>
			</DialogContent>
			<DialogActions>
				<Button disabled={alias.trim() === '' || querying} onClick={sendAlias}>{t('common.confirm')}</Button>
			</DialogActions>
		</Dialog>
	)
}