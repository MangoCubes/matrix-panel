import { Edit, Tag } from "@mui/icons-material";
import { Button, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, InputAdornment, List, ListItem, ListItemIcon, ListItemText, TextField } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Room } from "../../../types/Room";

export function RoomDetailsEdit(props: {room: Room, disableTabs: (to: boolean) => void}){

	const {t} = useTranslation();

	const [open, setOpen] = useState<boolean>(false);

	return (
		<CardContent>
			<List>
				<ListItem secondaryAction={
					<IconButton edge='end' onClick={() => setOpen(true)}>
						<Edit/>
					</IconButton>
            	}>
					<ListItemIcon>
						<Tag/>	
					</ListItemIcon>
					<ListItemText primary={t(`room.options.alias.name${props.room.canonical_alias === null ? 'Unset' : ''}`)} secondary={t('room.options.alias.desc')}/>
					<AliasDialog room={props.room} open={open} close={() => setOpen(false)}/>
				</ListItem>
			</List>
		</CardContent>
	)
}

function AliasDialog(props: {room: Room, open: boolean, close: () => void}){

	const {t} = useTranslation();

	const [alias, setAlias] = useState<string>('');
	const [querying, setQuerying] = useState<boolean>(false);

	return (
		<Dialog open={props.open} onClose={props.close}>
			<DialogTitle>{t('room.options.alias.setNewAlias')}</DialogTitle>
			<DialogContent>
				<TextField
					variant='standard'
					value={alias}
					disabled={querying}
					onChange={(e) => setAlias(e.currentTarget.value)}
					label={t('room.options.alias.newAlias')}
					InputProps={{
						startAdornment: <InputAdornment position='start'>#</InputAdornment>,
						// endAdornment: <InputAdornment position='start'>{props.room.}</InputAdornment>
					}}
				/>
			</DialogContent>
			<DialogActions>
				<Button disabled={alias.trim() === ''}>{t('common.confirm')}</Button>
			</DialogActions>
		</Dialog>
	)
}