import { PersonOff, AdminPanelSettings, Badge, Password } from "@mui/icons-material";
import { CardContent, List, ListItem, ListItemIcon, ListItemText, Switch, Button, CardActions, FormControl, TextField, DialogActions, Dialog, DialogContent, DialogTitle, Stack } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
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
	const [open, setOpen] = useState(false);

	const sendQuery = async () => {
		if(defaultData.deactivated && !userData.deactivated && userData.password === null){
			toast.error(t('user.options.deactivate.noPassword'));
			return;
		}
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
				<ListItem>
					<ListItemIcon>
						<Password/>	
					</ListItemIcon>
					<ListItemText primary={t('user.options.password.title')} secondary={t(`user.options.password.desc`)}/>
					<Button onClick={() => setOpen(true)}>{t('user.options.password.reset')}</Button>
				</ListItem>
			</List>
		</CardContent>
		<CardActions>
			<Button sx={{ml: 'auto'}} onClick={sendQuery}>{t('common.confirm')}</Button>
		</CardActions>
		<PasswordDialog user={props.user} open={open} close={() => setOpen(false)} confirm={(pw) => setUserData({...userData, password: {
			password: pw,
			logout: true
		}})}/>
		</>
	);
}

enum ErrorMsg {
	None,
	Empty,
	Mismatch
}

function PasswordDialog(props: {user: User, open: boolean, close: () => void, confirm: (pw: string) => void}){

	const [password, setPassword] = useState('');
	const [verify, setVerify] = useState('');

	const [error, setError] = useState<ErrorMsg>(ErrorMsg.None);

	const {t} = useTranslation();

	const confirm = () => {
		if(password.length === 0) setError(ErrorMsg.Empty);
		else if(password !== verify) setError(ErrorMsg.Mismatch);
		else {
			setError(ErrorMsg.None);
			props.confirm(password);
			props.close();
		}
	}

	const getHelperText = () => {
		if(error === ErrorMsg.Empty) return t('user.options.password.empty');
		else if(error === ErrorMsg.Mismatch) return t('user.options.password.mismatch');
		return ' ';
	}

	return (
		<Dialog open={props.open} onClose={props.close}>
			<DialogTitle>{t('user.options.password.dialogTitle', {uid: props.user.name})}</DialogTitle>
			<DialogContent>
				<Stack spacing={1}>
					<TextField
						variant='standard'
						value={password}
						onChange={(e) => setPassword(e.currentTarget.value)}
						label={t('user.options.password.password')}
						error={error !== ErrorMsg.None}
						helperText={getHelperText()}
						type='password'
					/>
					<TextField
						variant='standard'
						value={verify}
						onChange={(e) => setVerify(e.currentTarget.value)}
						label={t('user.options.password.verify')}
						type='password'
					/>
				</Stack>
			</DialogContent>
			<DialogActions>
				<Button disabled={password.length === 0} onClick={confirm}>{t('common.confirm')}</Button>
			</DialogActions>
		</Dialog>
	)
}