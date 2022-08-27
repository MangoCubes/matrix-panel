import { Public, Chat } from "@mui/icons-material";
import { Dialog, DialogTitle, DialogContent, DialogContentText, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Room } from "../../../types/Room";

export function ChildrenDialog(props: {open: boolean, parent: Room, children: Room[], close: () => void}){

	const {t} = useTranslation();

	const nav = useNavigate();

	const genList = () => {
		const items = [];
		for(const c of props.children) items.push (
			<ListItemButton key={c.room_id} onClick={() => nav(`/rooms/${c.room_id}`)}>
				<ListItemIcon>{c.room_type === 'm.space' ? <Public/> : <Chat/>}</ListItemIcon>
				<ListItemText primary={c.name + (c.canonical_alias ? ` (${c.canonical_alias})` : '')} secondary={c.room_id}/>
			</ListItemButton>
		)
		return items;
	}

	return (
		<Dialog open={props.open} onClose={props.close}>
			<DialogTitle>{t('room.details.children.dialog.title', {rid: props.parent.room_id})}</DialogTitle>
			<DialogContent>
				<DialogContentText>{t('room.details.children.dialog.body')}</DialogContentText>
				<List>
					{genList()}
				</List>
			</DialogContent>
		</Dialog>
	)
}