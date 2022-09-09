import { Route, Routes } from "react-router-dom";
import { Room } from "../../types/Room";
import { RoomDetailsPage } from "./roomId/RoomDetailsPage";
import { Rooms } from "./Rooms";
import { Spaces } from "./spaces/Spaces";

export function RoomLoader(props: {rooms: Room[] | null}){
	return (
		<Routes>
			<Route path='spaces' element={<Spaces rooms={props.rooms}/>}/>
			<Route path=':rid/*' element={<RoomDetailsPage rooms={props.rooms}/>}/>
			<Route path='*' element={<Rooms rooms={props.rooms}/>}/>
		</Routes>
	);
}