import { AdminPanelSettings, Mail, PersonAdd, History } from "@mui/icons-material";
import { Button, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, List, ListItem, ListItemIcon, ListItemText, Radio, RadioGroup } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { JoinRoomQuery } from "../../../query/JoinRoomQuery";
import { PurgeHistoryQuery } from "../../../query/PurgeHistoryQuery";
import { Query, QueryType } from "../../../query/Query";
import { SetUserRoomAdminQuery } from "../../../query/SetUserRoomAdminQuery";
import { LoginContext } from "../../../storage/LoginInfo";
import { MembershipEvent, RoomWithState } from "../../../types/Room";
import { RoomID } from "../../../types/Types";

export function RoomDetailsEdit(props: {room: RoomWithState, reload: () => void, disableTabs: (to: boolean) => void}){

	const {t} = useTranslation();

	const {homeserver, token, uid} = useContext(LoginContext);

	const [querying, setQuerying] = useState<boolean>(false);
	const [open, setOpen] = useState(false);

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
			if (reload) props.reload();
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

	return (
		<CardContent>
			<List>
				{getJoinAction()}
				<ListItem secondaryAction={
					<Button onClick={() => setOpen(true)} disabled={querying}>{t('room.options.purge.purge')}</Button>
				}>
					<ListItemIcon>
						<History/>
					</ListItemIcon>
					<ListItemText primary={t(`room.options.purge.name`)} secondary={t(`room.options.purge.desc`)}/>
				</ListItem>
			</List>
			<PurgeDialog rid={props.room.room_id} open={open} close={() => setOpen(false)}/>
		</CardContent>
	)
}

enum Range {
	All = 'All',
	Until = 'Until'
}

function PurgeDialog(props: {rid: RoomID, open: boolean, close: () => void}) {

	const {t} = useTranslation();

	const {homeserver, token} = useContext(LoginContext);

	const [querying, setQuerying] = useState<boolean>(false);

	const [range, setRange] = useState<Range>(Range.All);

	const purge = async () => {
		setQuerying(true);
		try{
			const req = new PurgeHistoryQuery(homeserver, {rid: props.rid, local: true, ts: new Date().getTime()}, token);
			await req.send();
			toast.success(t(`room.options.purge.success`));
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
		} finally {
			setQuerying(false);
		}
	}

	const rangeText = () => {
		if(range === Range.All) return t('room.options.purge.dialog.descAll');
		else return t('room.options.purge.dialog.descUntil');
	}

	return (
		<Dialog open={props.open} onClose={props.close}>
			<DialogTitle>{t(`room.options.purge.name`)}</DialogTitle>
			<DialogContent>
				<FormControl>
					<FormLabel>{t('room.options.purge.dialog.select')}</FormLabel>
					<RadioGroup value={Range.All} onChange={(e) => setRange(e.target.value as Range)}>
						<FormControlLabel value={Range.All} control={<Radio checked={range === Range.All}/>} label={t('room.options.purge.dialog.all')} />
						<FormControlLabel value={Range.Until} control={<Radio checked={range === Range.Until}/>} label={t('room.options.purge.dialog.until')} />
					</RadioGroup>
					<DialogContentText>{rangeText()}</DialogContentText>
					<DialogContentText>{t('room.options.purge.dialog.notRoomStates')}</DialogContentText>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button onClick={purge} disabled={querying}>{t('common.confirm')}</Button>
			</DialogActions>
		</Dialog>
	)

}