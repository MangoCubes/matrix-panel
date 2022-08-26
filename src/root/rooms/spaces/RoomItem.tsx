import { Chat, Info } from "@mui/icons-material";
import { IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { RoomID } from "../../../types/Types";
import { RoomMap } from "./Spaces";

export function RoomItem(props: {rid: RoomID, map: RoomMap, level: number}){

	const nav = useNavigate();


	const room = props.map[props.rid];
	if (room) return (
		<ListItem secondaryAction={
			<IconButton onClick={() => nav(`/rooms/${room.room_id}`)}>
				<Info/>
			</IconButton>
		} sx={{ pl: 4 * props.level }}>
			<ListItemButton>
				<ListItemIcon>
					<Chat/>
				</ListItemIcon>
				<ListItemText primary={room.name + (room.canonical_alias ? ` ${room.canonical_alias}` : '')} secondary={room.room_id}/>
			</ListItemButton>
		</ListItem>
	);
	else return null;
}