import { Edit, Tag } from "@mui/icons-material";
import { CardContent, IconButton, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Room } from "../../../types/Room";

export function RoomDetailsEdit(props: {room: Room, disableTabs: (to: boolean) => void}){

	const {t} = useTranslation();

	return (
		<CardContent>
			<List>
				<ListItem secondaryAction={
					<IconButton edge='end'>
						<Edit/>
					</IconButton>
            	}>
					<ListItemIcon>
						<Tag/>	
					</ListItemIcon>
					<ListItemText primary={t('room.options.alias.name')} secondary={t('room.options.alias.desc')}/>
				</ListItem>
			</List>
		</CardContent>
	)
}