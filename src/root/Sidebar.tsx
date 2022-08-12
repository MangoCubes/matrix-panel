import { Person, Refresh, Chat, Storage } from "@mui/icons-material";
import { Drawer, ListItem, Tooltip, IconButton, ListItemText, Divider, Box, List, ListItemButton, ListItemIcon, Toolbar } from "@mui/material";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../storage/LoginInfo";

const drawer = 240;

export function Sidebar(){

	const {homeserver, uid} = useContext(LoginContext);

	const nav = useNavigate();
	const {t} = useTranslation();
	
	return (
		<Drawer variant='permanent' sx={{ width: drawer }} open={true} anchor='left'>
			<Toolbar sx={{ maxWidth: drawer }}>
				<ListItem secondaryAction={
					<Tooltip title={t('sidebar.reload')}>
						<span>
							<IconButton edge='end' onClick={() => {}}>
								<Refresh/>
							</IconButton>
						</span>
					</Tooltip>
				}>
					<ListItemText primary={uid} secondary={t('sidebar.loggedInto', {homeserver: homeserver})}/>
				</ListItem>
			</Toolbar>
			<Divider/>
			<Box sx={{display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden'}}>
				<List sx={{ width: drawer, overflow: 'auto'}}>
					<ListItemButton onClick={() => nav(``)}>
						<ListItemIcon>
							<Storage/>
						</ListItemIcon>
						<ListItemText primary={t('sidebar.overview')}/>
					</ListItemButton>
					<ListItemButton onClick={() => nav(`rooms`)}>
						<ListItemIcon>
							<Chat/>
						</ListItemIcon>
						<ListItemText primary={t('sidebar.rooms')}/>
					</ListItemButton>
					<ListItemButton onClick={() => nav(`users`)}>
						<ListItemIcon>
							<Person/>
						</ListItemIcon>
						<ListItemText primary={t('sidebar.users')}/>
					</ListItemButton>
				</List>
			</Box>
		</Drawer>
	);
}