import { useState, useRef, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Routes, Route } from "react-router-dom";
import handleCommonErrors from "../../functions/handleCommonErrors";
import { GetUsersQuery } from "../../query/GetUsersQuery";
import { LoginContext } from "../../storage/LoginInfo";
import { User } from "../../types/User";
import { Users } from "./Users";

export function UserLoader(){

	const {t} = useTranslation();

	const [reload, setReload] = useState(true);
	const [users, setUsers] = useState<User[] | null>(null);

	const con = useRef<AbortController | null>(null);

	const {homeserver, token} = useContext(LoginContext);

	const getUsers = async () => {
		setUsers(null);
		setReload(false);
		try{
			const req = new GetUsersQuery(homeserver, {}, token);
			con.current = req.con;
			const res = await req.send();
			setUsers(res.users);
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
		}
	}

	useEffect(() => {
		if(reload && !users) getUsers();
	}, [reload]);

	useEffect(() => {
		return () => {
			if(con.current) con.current.abort();
		}
	}, []);

	return (
		<Routes>
			<Route path='*' element={<Users users={users}/>}/>
		</Routes>
	);
}