import { Box } from "@mui/material";
import { useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Route, Routes } from "react-router-dom";
import { toast } from "react-toastify";
import handleCommonErrors from "../functions/handleCommonErrors";
import { GetRoomsQuery } from "../query/GetRoomsQuery";
import { GetUsersQuery } from "../query/GetUsersQuery";
import { LoginContext } from "../storage/LoginInfo";
import { ReloadContext } from "../storage/Reloads";
import { Room } from "../types/Room";
import { User } from "../types/User";
import { Overview } from "./Overview";
import { RoomLoader } from "./rooms/RoomLoader";
import { Sidebar } from "./Sidebar";
import { UserLoader } from "./users/UserLoader";

export function MainPage(){

	const {t} = useTranslation();

	const [users, setUsers] = useState<User[] | null>(null);
	const [rooms, setRooms] = useState<Room[] | null>(null);

	const {homeserver, uid, token} = useContext(LoginContext);

	useEffect(() => {
		getUsers();
		getRooms();
	}, []);

	const getUsers = async () => {
		setUsers(null);
		try{
			const req = new GetUsersQuery(homeserver, {}, token);
			const res = await req.send();
			const userList = [...res.users];
			const idx = userList.findIndex(u => u.displayname === uid);
			if(idx !== -1) userList.unshift(userList.splice(idx, 1)[0]);
			setUsers(res.users);
		} catch (e) {
			if (e instanceof Error) {
				const msg = handleCommonErrors(e);
				if (msg) toast.error(t(msg));
			}
		}
	}

	const getRooms = async () => {
		setRooms(null);
		try{
			const req = new GetRoomsQuery(homeserver, {}, token);
			const res = await req.send();
			setRooms(res.rooms);
		} catch (e) {
			if (e instanceof Error) {
				const msg = handleCommonErrors(e);
				if (msg) toast.error(t(msg));
			}
		}
	}

	return (
		<ReloadContext.Provider value={{
			reloadUsers: getUsers,
			reloadRooms: getRooms
		}}>
			<Box sx={{display: 'flex', width: '100vw', height: '100vh'}}>
				<Sidebar/>
				<Box sx={{flex: 1, height: '100%'}}>
					<Routes>
						<Route path={'rooms/*'} element={<RoomLoader rooms={rooms}/>}/>
						<Route path={'users/*'} element={<UserLoader users={users}/>}/>
						<Route path={''} element={<Overview/>}/>
					</Routes>
				</Box>
			</Box>
		</ReloadContext.Provider>
	);
}