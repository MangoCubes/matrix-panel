import { Add, Lock } from "@mui/icons-material";
import { CardContent, CardActions, Button, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { DeleteRoomQuery } from "../../../query/DeleteRoomQuery";
import { LoginContext } from "../../../storage/LoginInfo";
import { Room, RoomState } from "../../../types/Room";

export function RoomDetailsEdit(props: {room: Room, states: RoomState[], disableTabs: (to: boolean) => void}) {

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

	useEffect(() => {
		props.disableTabs(querying);
	}, [querying]);

	return (
		<>
		<CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
			<List>
				<ListItem>
					<ListItemIcon><Add/></ListItemIcon>
					<ListItemText primary={props.room.creator} secondary={t('room.details.creator')}/>
				</ListItem>
				<ListItem>
					<ListItemIcon><Lock color={props.room.encryption === null ? 'error' : 'success'}/></ListItemIcon>
					<ListItemText primary={`${t(props.room.encryption === null ? 'common.disabled' : 'common.enabled')}`} secondary={t('room.details.encryption')}/>
				</ListItem>
			</List>
		</CardContent>
		<CardActions>
			<Button sx={{ml: 'auto'}} color='error' disabled={querying} onClick={() => deleteRoom()}>{t('room.details.delete')}</Button>
		</CardActions>
		</>
	);
}