import { Routes, Route } from "react-router-dom";
import { User } from "../../types/User";
import { UserDetailsPage } from "./userId/UserDetailsPage";
import { Users } from "./Users";

export function UserLoader(props: {users: User[] | null}){
	return (
		<Routes>
			<Route path=':uid/*' element={<UserDetailsPage users={props.users}/>}/>
			<Route path='*' element={<Users users={props.users}/>}/>
		</Routes>
	);
}