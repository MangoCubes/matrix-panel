import { ExpandLess, ExpandMore, Public } from "@mui/icons-material";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useState } from "react";
import { RoomID } from "../../../types/Types";
import { RoomMap } from "./Spaces";

export function SpaceItem(props: {rid: RoomID, map: RoomMap}){

	const [open, setOpen] = useState<boolean>(false);

	const onClick = () => {
		setOpen(!open);
	}

	const room = props.map[props.rid];
	if (room) return (
		<>
		<ListItemButton onClick={onClick}>
			<ListItemIcon>
				<Public/>
			</ListItemIcon>
			<ListItemText primary={`${room.name}${room.canonical_alias === null || room.canonical_alias === '' ? '' : ` (${room.canonical_alias})`}`} secondary={room.room_id}/>
			{open ? <ExpandLess /> : <ExpandMore />}
		</ListItemButton>
		</>
	);
	else return null;
}