import { ExpandLess, ExpandMore, Public } from "@mui/icons-material";
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useState } from "react";
import { RoomID } from "../../../types/Types";
import { RoomMap } from "./Spaces";

export function SpaceItem(props: {rid: RoomID, map: RoomMap, level: number}){

	const [open, setOpen] = useState<boolean>(false);

	const onClick = () => {
		setOpen(!open);
	}

	const getChildren = () => {
		const rooms = [];
		const spaces = [];
		const r = props.map[props.rid];
		for(const s of r.states) {
			if(s.type === 'm.space.child') {
				const child = props.map[s.state_key];
				if(!child) continue;
				if(child.room_type === 'm.space') spaces.push(s.state_key);
				else rooms.push(s.state_key);
			}
		}
		return {rooms: rooms, spaces: spaces};
	}

	const renderChildren = () => {
		const {rooms, spaces} = getChildren();
		const items = [];
		for(const s of spaces) items.push(<SpaceItem rid={s} map={props.map} level={props.level + 1} key={s}/>);
		return items;
	}

	const room = props.map[props.rid];
	if (room) return (
		<>
		<ListItemButton onClick={onClick} sx={{ pl: 4 * props.level }}>
			<ListItemIcon>
				<Public/>
			</ListItemIcon>
			<ListItemText primary={`${room.name}${room.canonical_alias === null || room.canonical_alias === '' ? '' : ` (${room.canonical_alias})`}`} secondary={room.room_id}/>
			{open ? <ExpandLess /> : <ExpandMore />}
		</ListItemButton>
		<Collapse in={open} unmountOnExit>
			<List disablePadding>
				{renderChildren()}
			</List>
		</Collapse>
		</>
	);
	else return null;
}