import { CardContent, CardActions, Button } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { DeleteRoomQuery } from "../../../query/DeleteRoomQuery";
import { GetRoomStateQuery } from "../../../query/GetRoomStateQuery";
import { LoginContext } from "../../../storage/LoginInfo";
import { Room, RoomState } from "../../../types/Room";

export function RoomDetailsEdit(props: {room: Room, disableTabs: (to: boolean) => void}) {

	const {t} = useTranslation();

	const {homeserver, token} = useContext(LoginContext);

	const [querying, setQuerying] = useState<boolean>(false);
	const [reload, setReload] = useState(true);
	const [states, setStates] = useState<RoomState[] | null>(null);

	const con = useRef<AbortController | null>(null);

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

	const getStates = async () => {
		setStates(null);
		setReload(false);
		try{
			const req = new GetRoomStateQuery(homeserver, {rid: props.room.room_id}, token);
			con.current = req.con;
			const res = await req.send();
			setStates(res.state);
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
		}
	}

	useEffect(() => {
		if(reload) getStates();
	}, [reload]);

	useEffect(() => {
		return () => {
			if(con.current) con.current.abort();
		}
	}, []);

	useEffect(() => {
		props.disableTabs(querying);
	}, [querying]);

	return (
		<>
		<CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
		</CardContent>
		<CardActions>
			<Button sx={{ml: 'auto'}} color='error' disabled={querying} onClick={() => deleteRoom()}>{t('room.details.delete')}</Button>
		</CardActions>
		</>
	);
}