import { Person, Chat, Storage, Public, Logout } from "@mui/icons-material";
import { Drawer, ListItem, ListItemText, Divider, Box, List, ListItemButton, ListItemIcon, Toolbar } from "@mui/material";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import handleCommonErrors from "../functions/handleCommonErrors";
import { LogoutQuery } from "../query/LogoutQuery";
import { LoginContext } from "../storage/LoginInfo";

const drawer = 240;

export function Sidebar(){

	const {homeserver, token, uid} = useContext(LoginContext);

	const [querying, setQuerying] = useState(false);

	const nav = useNavigate();

	const {t} = useTranslation();

	const logout = async () => {
		setQuerying(true);
		try{
			const req = new LogoutQuery(homeserver, {}, token);
			await req.send();
			nav('/login');
			toast.success(t('sidebar.logoutSuccess'));
			sessionStorage.clear();
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
		} finally {
			setQuerying(false);
		}
	}
	
	return (
		<Drawer variant='permanent' sx={{ width: drawer }} open={true} anchor='left'>
			<Toolbar sx={{ maxWidth: drawer }}>
				<ListItem>
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
					<ListItemButton onClick={() => nav(`rooms/spaces`)}>
						<ListItemIcon>
							<Public/>
						</ListItemIcon>
						<ListItemText primary={t('sidebar.spaces')} />
					</ListItemButton>
					<ListItemButton onClick={() => nav(`users`)}>
						<ListItemIcon>
							<Person/>
						</ListItemIcon>
						<ListItemText primary={t('sidebar.users')}/>
					</ListItemButton>
				</List>
				<Box sx={{flex: 1}}/>
				<List sx={{ width: drawer, overflow: 'auto'}}>
					<ListItemButton onClick={logout} disabled={querying}>
						<ListItemIcon>
							<Logout/>
						</ListItemIcon>
						<ListItemText primary={t('sidebar.logout')}/>
					</ListItemButton>
				</List>
			</Box>
		</Drawer>
	);
}