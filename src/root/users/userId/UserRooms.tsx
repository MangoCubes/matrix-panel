import { Button, CardActions, CardContent, Link } from "@mui/material";
import { GridColumns, DataGrid, GridRenderCellParams } from "@mui/x-data-grid";
import { useState, useRef, useContext, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { GetUserMembershipQuery } from "../../../query/GetUserMembershipQuery";
import { LoginContext } from "../../../storage/LoginInfo";
import { Room } from "../../../types/Room";
import { RoomID } from "../../../types/Types";
import { User } from "../../../types/User";

export default function UserRooms(props: {user: User, rooms: Room[] | null}) {
	const {t} = useTranslation();

	const [rooms, setRooms] = useState<RoomID[] | null>(null);
	const [rows, setRows] = useState<{id: RoomID, name: string}[] | null>(null);

	const con = useRef<AbortController | null>(null);

	const nav = useNavigate();

	const {homeserver, token} = useContext(LoginContext);

	const columns = useMemo<GridColumns>(
		() => [
			{field: 'id', headerName: t('user.rooms.id'), flex: 2, renderCell: (params: GridRenderCellParams<RoomID>) => (
				<Link href='#' onClick={() => nav(`/rooms/${params.value}`)}>{params.value}</Link>
			)},
			{field: 'name', headerName: t('user.rooms.name'), flex: 2}
		],
		[]
	);

	const getRooms = async () => {
		setRooms(null);
		try{
			const req = new GetUserMembershipQuery(homeserver, {uid: props.user.name}, token);
			con.current = req.con;
			const res = await req.send();
			setRooms(res.joined_rooms);
		} catch (e) {
			if (e instanceof Error) {
				const msg = handleCommonErrors(e);
				if (msg) toast.error(t(msg));
			}
		}
	}

	useEffect(() => {
		getRooms();
	}, []);

	useEffect(() => {
		getRows();
	}, [rooms, props.rooms]);

	useEffect(() => {
		return () => {
			if(con.current) con.current.abort();
		}
	}, []);

	const getRows = () => {
		if(rooms && props.rooms){
			const rows = [];
			for(const r of rooms){
				const room = props.rooms.find(room => room.room_id === r);
				if(!room) continue;
				rows.push({
					id: r,
					name: room.name
				});
			}
			setRows(rows);
			return rows;
		} else setRows(null);
	}

	return (
		<>
		<CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
			<DataGrid
				sx={{flex: 1}}
				columns={columns}
				rows={rows === null ? [] : rows}
				loading={rows === null}
			/>
		</CardContent>
		<CardActions>
			<Button onClick={getRooms}>{t('common.reload')}</Button>
		</CardActions>
		</>
	);
}