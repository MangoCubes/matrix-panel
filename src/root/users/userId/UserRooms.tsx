import { CardContent } from "@mui/material";
import { GridColumns, DataGrid } from "@mui/x-data-grid";
import { useState, useRef, useContext, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { GetUserMembershipQuery } from "../../../query/GetUserMembershipQuery";
import { LoginContext } from "../../../storage/LoginInfo";
import { RoomID } from "../../../types/Types";
import { User } from "../../../types/User";

export default function UserRooms(props: {user: User}) {
	const {t} = useTranslation();

	const [reload, setReload] = useState(true);
	const [rooms, setRooms] = useState<RoomID[] | null>(null);

	const con = useRef<AbortController | null>(null);

	const {homeserver, token} = useContext(LoginContext);

	const columns = useMemo<GridColumns>(
		() => [
			{field: 'id', headerName: t('user.rooms.id'), flex: 2},
		],
		[]
	);

	const getRooms = async () => {
		setRooms(null);
		setReload(false);
		try{
			const req = new GetUserMembershipQuery(homeserver, {uid: props.user.name}, token);
			con.current = req.con;
			const res = await req.send();
			setRooms(res.joined_rooms);
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
		}
	}

	useEffect(() => {
		if(reload) getRooms();
	}, [reload]);

	useEffect(() => {
		return () => {
			if(con.current) con.current.abort();
		}
	}, []);

	const getRows = () => {
		if(rooms){
			const rows = [];
			for(const r of rooms){
				rows.push({
					id: r,
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
				loading={rooms === null}
			/>
		</CardContent>
		</>
	);
}