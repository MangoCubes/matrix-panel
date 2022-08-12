import { Box } from "@mui/material";
import { Sidebar } from "./Sidebar";

export function MainPage(){
	return (
		<Box sx={{display: 'flex', width: '100%'}}>
			<Sidebar/>
			<Box sx={{flex: 1}}>
				123
			</Box>
		</Box>
	);
}