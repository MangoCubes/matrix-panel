import { PersonOff, AdminPanelSettings, Badge } from "@mui/icons-material";
import { CardContent, List, ListItem, ListItemIcon, ListItemText, Switch, Button, CardActions, FormControl, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { EditUserQuery, EditUserQueryData } from "../../../query/EditUserQuery";
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

export function UserDetailsEdit(props: {user: User, disableTabs: (to: boolean) => void, reload: () => void}) {

	const {t} = useTranslation();

	const {homeserver, uid, token} = useContext(LoginContext);

	const defaultData: UserData = {
		password: null,
		displayName: props.user.displayname ? props.user.displayname : '',
		avatar: props.user.avatar_url,
		deactivated: props.user.deactivated === 1,
		admin: props.user.admin === 1,
		userType: props.user.user_type
	}

	const [userData, setUserData] = useState<UserData>(defaultData);
	const [querying, setQuerying] = useState(false);

	const sendQuery = async () => {
		try{
			props.disableTabs(true);
			setQuerying(true);
			const reqData: EditUserQueryData = {};
			if(userData.password) {
				reqData['password'] = userData.password.password;
				reqData['logout'] = userData.password.logout;
			}
			if(userData.displayName) reqData['displayname'] = userData.displayName;
			if(userData.avatar) reqData['avatar_url'] = userData.avatar;
			//TODO: Use deactivate query for erasing all data
			const req = new EditUserQuery(homeserver, {
				uid: props.user.name,
				data: {
					...reqData,
					admin: userData.admin,
					deactivated: userData.deactivated,
					user_type: userData.userType,
				}
			}, token);
			await req.send();
			props.reload();
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
		} finally {
			setQuerying(false);
			props.disableTabs(false);
		}
	}

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
					<TextField variant='standard' value={userData.displayName} disabled={querying} onChange={e => setUserData({...userData, displayName: e.currentTarget.value})}/>
				</ListItem>
			</List>
		</CardContent>
		<CardActions>
			<Button sx={{ml: 'auto'}} onClick={sendQuery}>{t('common.confirm')}</Button>
		</CardActions>
		</>
	);
}