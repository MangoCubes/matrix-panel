import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import handleCommonErrors from "../../functions/handleCommonErrors";
import { GetRoomsQuery } from "../../query/GetRoomsQuery";
import { LoginContext } from "../../storage/LoginInfo";
import { Room } from "../../types/Room";
import { RoomDetailsPage } from "./roomId/RoomDetailsPage";
import { Rooms } from "./Rooms";
import { Spaces } from "./spaces/Spaces";

export function RoomLoader(){

	const {t} = useTranslation();

	const [reload, setReload] = useState(true);
	const [rooms, setRooms] = useState<Room[] | null>(null);

	const con = useRef<AbortController | null>(null);

	const {homeserver, token} = useContext(LoginContext);

	const getRooms = async () => {
		setRooms(null);
		setReload(false);
		try{
			const req = new GetRoomsQuery(homeserver, {}, token);
			con.current = req.con;
			const res = await req.send();
			setRooms(res.rooms);
		} catch (e) {
			if (e instanceof Error) {
				const msg = handleCommonErrors(e);
				if (msg) toast.error(t(msg));
			}
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

	return (
		<Routes>
			<Route path='spaces' element={<Spaces rooms={rooms} reload={() => setReload(true)}/>}/>
			<Route path=':rid/*' element={<RoomDetailsPage rooms={rooms} reload={() => setReload(true)}/>}/>
			<Route path='*' element={<Rooms rooms={rooms} reload={() => setReload(true)}/>}/>
		</Routes>
	);
}