import { AdminPanelSettings, Mail, PersonAdd, History, Block } from "@mui/icons-material";
import { Button, CardContent, Checkbox, CircularProgress, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, List, ListItem, ListItemIcon, ListItemText, Radio, RadioGroup, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { toast } from "react-toastify";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { JoinRoomQuery } from "../../../query/JoinRoomQuery";
import { PurgeHistoryQuery } from "../../../query/PurgeHistoryQuery";
import { Query, QueryType } from "../../../query/Query";
import { SetUserRoomAdminQuery } from "../../../query/SetUserRoomAdminQuery";
import { LoginContext } from "../../../storage/LoginInfo";
import { MembershipEvent, RoomWithState } from "../../../types/Room";
import { RoomID } from "../../../types/Types";
import { Moment } from "moment";
import { HTTPError } from "../../../class/error/HTTPError";
import { GetBlockStatusQuery } from "../../../query/GetBlockStatusQuery";
import { BlockRoomQuery } from "../../../query/BlockRoomQuery";

export function RoomDetailsEdit(props: {room: RoomWithState, reload: () => void, disableTabs: (to: boolean) => void}){

	const {t} = useTranslation();

	const {homeserver, token, uid} = useContext(LoginContext);

	const [querying, setQuerying] = useState<boolean>(false);
	const [open, setOpen] = useState(false);
	const [blocked, setBlocked] = useState<boolean | null>(null);

	const con = useRef<AbortController>(new AbortController());

	useEffect(() => {
		props.disableTabs(querying);
	}, [querying]);

	const getBlockedStatus = async () => {
		try{
			const req = new GetBlockStatusQuery(homeserver, {rid: props.room.room_id}, token, con.current);
			const res = await req.send();
			setBlocked(res.block);
		} catch(e){
			if (e instanceof Error) {
				const msg = handleCommonErrors(e);
				if (msg) toast.error(t(msg));
			}
		}
	}

	useEffect(() => {
		getBlockedStatus();
	}, []);

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
			if (e instanceof Error) {
				const msg = handleCommonErrors(e);
				if (msg) toast.error(t(msg));
			}
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

	const toggleBlock = async () => {
		await sendQuery(false, new BlockRoomQuery(homeserver, {rid: props.room.room_id, block: !blocked}, token), t(`room.options.block.success${blocked ? 'Unblock' : ''}`));
		getBlockedStatus();
	}

	const getBlockedItem = () => {
		if(blocked === null) return (
			<ListItem>
				<CircularProgress/>
			</ListItem>
		);
		else return (
			<ListItem secondaryAction={
				<Button onClick={toggleBlock} disabled={querying}>{t(`room.options.block.${blocked ? 'unblock' : 'block'}`)}</Button>
			}>
				<ListItemIcon>
					<Block/>
				</ListItemIcon>
				<ListItemText primary={t(`room.options.block.name${blocked ? 'Unblock' : ''}`)} secondary={t(`room.options.block.desc${blocked ? 'Unblock' : ''}`)}/>
			</ListItem>
		);
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
				{getBlockedItem()}
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
	const [until, setUntil] = useState<Date>(new Date());
	const [local, setLocal] = useState(true);

	const purge = async () => {
		setQuerying(true);
		try{
			const req = new PurgeHistoryQuery(homeserver, {
				rid: props.rid,
				local: local,
				ts: range === Range.All ? new Date().getTime() : until.getTime()
			}, token);
			await req.send();
			toast.success(t(`room.options.purge.success`));
			props.close();
		} catch (e) {
			const locallyHandled = [404];
			if (e instanceof Error) {
				if(e instanceof HTTPError && locallyHandled.includes(e.errCode)){
					if(e.errCode === 404) toast.error(t('room.options.purge.dialog.noMessage'))
					return;
				}
				const msg = handleCommonErrors(e);
				if (msg) toast.error(t(msg));
			}
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
						<Collapse unmountOnExit in={range === Range.Until}>
							<LocalizationProvider dateAdapter={AdapterMoment}>
								<DatePicker
									value={until}
									onChange={e => setUntil((e as unknown as Moment).toDate())} // Temporary fix
									renderInput={p => (
										<TextField {...p} variant='standard'/>
									)}
								/>
							</LocalizationProvider>
						</Collapse>
					</RadioGroup>
					<FormControlLabel control={<Checkbox checked={local} onChange={e => setLocal(e.target.checked)}/>} label={t('room.options.purge.dialog.deleteLocal')} />
				</FormControl>
				<DialogContentText>{rangeText()}</DialogContentText>
				<DialogContentText>{t('room.options.purge.dialog.notRoomStates')}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={purge} disabled={querying}>{t('common.confirm')}</Button>
			</DialogActions>
		</Dialog>
	)

}