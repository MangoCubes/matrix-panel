import { AdminPanelSettings, Edit, Tag } from "@mui/icons-material";
import { Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, List, ListItem, ListItemIcon, ListItemText, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import handleCommonErrors from "../../../functions/handleCommonErrors";
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

	const setRoomAdmin = async (isInvite: boolean) => {
		setQuerying(true);
		try{
			const req = new SetUserRoomAdminQuery(homeserver, {rid: props.room.room_id, uid: uid}, token);
			await req.send();
			toast.success(isInvite ? t('room.options.join.success') : t('room.options.admin.success'));
			props.reload();
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
		} finally {
			setQuerying(false);
		}
	}

	const getJoinAction = () => {
		let title = t(`room.options.join.name`);
		let desc = t(`room.options.join.desc`);
		let joinRoom = true;
		const membership = props.room.states.find(s => s.type === 'm.room.member' && s.state_key === uid);
		if(membership){
			const m = membership as MembershipEvent;
			if(m.content.membership === 'join'){ //Already member
				title = t(`room.options.admin.name`);
				desc = t('room.options.admin.desc');
				joinRoom = false;
			}
		} //Not a member
		
		return (
			<ListItem secondaryAction={
				<Button onClick={() => setRoomAdmin(joinRoom)} disabled={querying}>{t('common.confirm')}</Button>
			}>
				<ListItemIcon>
					<AdminPanelSettings/>	
				</ListItemIcon>
				<ListItemText primary={title} secondary={desc}/>
			</ListItem>
		)
	}

	return (
		<CardContent>
			<List>
				{getJoinAction()}
				<ListItem secondaryAction={
					<IconButton edge='end' onClick={() => setOpen(true)}>
						<Edit/>
					</IconButton>
            	}>
					<ListItemIcon>
						<Tag/>	
					</ListItemIcon>
					<ListItemText primary={t(`room.options.alias.name${props.room.canonical_alias === null ? 'Unset' : ''}`)} secondary={t('room.options.alias.desc')}/>
					<AliasDialog room={props.room} open={open} close={() => setOpen(false)}/>
				</ListItem>
			</List>
		</CardContent>
	)
}

function AliasDialog(props: {room: RoomWithState, open: boolean, close: () => void}){

	const {t} = useTranslation();

	const [alias, setAlias] = useState<string>('');
	const [querying, setQuerying] = useState<boolean>(false);

	return (
		<Dialog open={props.open} onClose={props.close}>
			<DialogTitle>{t('room.options.alias.setNewAlias')}</DialogTitle>
			<DialogContent>
				<TextField
					variant='standard'
					value={alias}
					disabled={querying}
					onChange={(e) => setAlias(e.currentTarget.value)}
					label={t('room.options.alias.newAlias')}
					InputProps={{
						startAdornment: <InputAdornment position='start'>#</InputAdornment>,
						// endAdornment: <InputAdornment position='start'>{props.room.}</InputAdornment>
					}}
				/>
			</DialogContent>
			<DialogActions>
				<Button disabled={alias.trim() === ''}>{t('common.confirm')}</Button>
			</DialogActions>
		</Dialog>
	)
}