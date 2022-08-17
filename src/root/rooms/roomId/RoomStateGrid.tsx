import { CardContent } from "@mui/material";
import { GridColumns, DataGrid } from "@mui/x-data-grid";
import { useState, useRef, useContext, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { GetRoomStateQuery } from "../../../query/GetRoomStateQuery";
import { LoginContext } from "../../../storage/LoginInfo";
import { Room, RoomState } from "../../../types/Room";

export function RoomStateGrid(props: {room: Room}) {

	const {t} = useTranslation();

	const [reload, setReload] = useState(true);
	const [querying, setQuerying] = useState(false);
	const [states, setStates] = useState<RoomState[] | null>(null);

	const con = useRef<AbortController | null>(null);

	const {homeserver, token} = useContext(LoginContext);

	const columns = useMemo<GridColumns>(
		() => [
			{field: 'stateType', headerName: t('room.state.type'), flex: 1},
			{field: 'stateKey', headerName: t('room.state.key'), flex: 1},
		],
		[]
	);

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

	const getRows = () => {
		if(states){
			const rows = [];
			let i = 0;
			for(const s of states){
				rows.push({
					id: i++,
					stateType: s.type,
					stateKey: s.state_key
				});
			}
			return rows;
		} else return [];
	}

	return (
		<>
		<CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
			<DataGrid
				sx={{flex: 1}}
				columns={columns}
				rows={getRows()}
				loading={states === null}
			/>
		</CardContent>
		</>
	);
}