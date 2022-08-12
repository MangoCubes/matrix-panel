import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import { RoomLoader } from "./rooms/RoomLoader";
import { Sidebar } from "./Sidebar";

export function MainPage(){
	return (
		<Box sx={{display: 'flex', width: '100vw', height: '100vh'}}>
			<Sidebar/>
			<Box sx={{flex: 1, height: '100%'}}>
				<Routes>
					<Route path={'rooms/*'} element={<RoomLoader/>}/>
				</Routes>
			</Box>
		</Box>
	);
}