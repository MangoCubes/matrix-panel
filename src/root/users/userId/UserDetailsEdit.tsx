import { PersonOff, AdminPanelSettings, Badge } from "@mui/icons-material";
import { CardContent, List, ListItem, ListItemIcon, ListItemText, Switch, Button, CardActions } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LoginContext } from "../../../storage/LoginInfo";
import { User } from "../../../types/User";


type UserData = {
	password: null | {
		password: string;
		logout: boolean;
	};
	displayName: string | null;
	avatar: string | null;
	deactivated: boolean;
	admin: boolean;
	userType: null | 'bot' | 'support';
}

export function UserDetailsEdit(props: {user: User, disableTabs: (to: boolean) => void}) {

	const {t} = useTranslation();

	const {homeserver, uid, token} = useContext(LoginContext);

	const defaultData: UserData = {
		password: null,
		displayName: props.user.displayname,
		avatar: props.user.avatar_url,
		deactivated: props.user.deactivated === 1,
		admin: props.user.admin === 1,
		userType: props.user.user_type
	}

	const [userData, setUserData] = useState<UserData>(defaultData);
	const [querying, setQuerying] = useState(false);

	useEffect(() => {
		props.disableTabs(querying);
	}, [querying]);

	return (
		<>
		<CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
			<List>
				<ListItem>
					<ListItemIcon>
						<PersonOff/>	
					</ListItemIcon>
					<ListItemText primary={t('user.options.deactivate.title')} secondary={t(`user.options.deactivate.desc${props.user.name === uid ? 'Self' : ''}`)}/>
					<Switch edge='end' checked={userData.deactivated} disabled={querying} onChange={() => setUserData({...userData, deactivated: !userData.deactivated})}/>
				</ListItem>
				<ListItem>
					<ListItemIcon>
						<AdminPanelSettings/>	
					</ListItemIcon>
					<ListItemText primary={t('user.options.admin.title')} secondary={t(`user.options.admin.desc${props.user.name === uid ? 'Self' : ''}`)}/>
					<Switch edge='end' checked={userData.admin} disabled={props.user.name === uid || querying} onChange={() => setUserData({...userData, admin: !userData.admin})} />
				</ListItem>
				<ListItem>
					<ListItemIcon>
						<Badge/>	
					</ListItemIcon>
					<ListItemText primary={t('user.options.displayName.title')} secondary={t(`user.options.displayName.desc`)}/>
				</ListItem>
			</List>
		</CardContent>
		<CardActions>
			<Button sx={{ml: 'auto'}}>{t('common.confirm')}</Button>
		</CardActions>
		</>
	);
}