import { AppBar, Toolbar, Typography } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Routes } from "react-router-dom";
import handleCommonErrors from "../../functions/handleCommonErrors";
import { GetRoomsQuery } from "../../query/GetRoomsQuery";
import { LoginContext } from "../../storage/LoginInfo";
import { Room } from "../../types/Room";

export function RoomLoader(){

	const {t} = useTranslation();

	const [reload, setReload] = useState(true);
	const [querying, setQuerying] = useState(false);
	const [rooms, setRooms] = useState<Room[]>([]);

	const con = useRef<AbortController | null>(null);

	const {homeserver, token} = useContext(LoginContext);

	const getRooms = async () => {
		setQuerying(true);
		setReload(false);
		try{
			const req = new GetRoomsQuery(homeserver, {}, token);
			const res = await req.send();
			setRooms(res.rooms);
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
		} finally {
			setQuerying(false);
		}
	}

	useEffect(() => {
		if(reload && !querying) getRooms(); 
		return () => {
			if(con.current) con.current.abort();
		}
	}, [reload]);

	return (
		<Routes>
			
		</Routes>
	);
}