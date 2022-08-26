import { ExpandLess, ExpandMore, Info, Public } from "@mui/icons-material";
import { Collapse, IconButton, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RoomID } from "../../../types/Types";
import { RoomItem } from "./RoomItem";
import { RoomMap } from "./Spaces";

export function SpaceItem(props: {rid: RoomID, map: RoomMap, level: number}){

	const [open, setOpen] = useState<boolean>(false);

	const nav = useNavigate();

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
				if (!child) continue;
				if (child.room_type === 'm.space') spaces.push(s.state_key);
				else rooms.push(s.state_key);
			}
		}
		return {rooms: rooms, spaces: spaces};
	}

	const renderChildren = () => {
		const {rooms, spaces} = getChildren();
		const items = [];
		for(const s of spaces) items.push(<SpaceItem rid={s} map={props.map} level={props.level + 1} key={s}/>);
		for(const r of rooms) items.push(<RoomItem rid={r} map={props.map} level={props.level + 1} key={r}/>);
		return items;
	}

	const room = props.map[props.rid];
	if (room) return (
		<>
		<ListItem secondaryAction={
			<IconButton onClick={() => nav(`/rooms/${room.room_id}`)}>
				<Info/>
			</IconButton>
		} sx={{ pl: 4 * props.level }}>
			<ListItemButton onClick={onClick}>
				<ListItemIcon>
					<Public/>
				</ListItemIcon>
				<ListItemText primary={`${room.name}${room.canonical_alias === null || room.canonical_alias === '' ? '' : ` (${room.canonical_alias})`}`} secondary={room.room_id}/>
				{open ? <ExpandLess /> : <ExpandMore />}
			</ListItemButton>
		</ListItem>
		<Collapse in={open} unmountOnExit>
			{renderChildren()}
		</Collapse>
		</>
	);
	else return null;
}