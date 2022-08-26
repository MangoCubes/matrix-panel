import { Add, History, Lock, PersonAdd, SupervisorAccount } from "@mui/icons-material";
import { CardContent, CardActions, Button, List, ListItem, ListItemIcon, ListItemText, Link, CircularProgress } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { DeleteRoomQuery } from "../../../query/DeleteRoomQuery";
import { LoginContext } from "../../../storage/LoginInfo";
import { Room, RoomState } from "../../../types/Room";

export function RoomDetails(props: {room: Room, states: RoomState[] | null, disableTabs: (to: boolean) => void}) {

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
		if(parent) items.push (
			<ListItem key='parent'>
				<ListItemIcon><SupervisorAccount/></ListItemIcon>
				<ListItemText primary={<Link href='#' onClick={() => nav(`/rooms/${parent.state_key}`)}>{parent.state_key}</Link>} secondary={t('room.details.parent')}/>
			</ListItem>
		);
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