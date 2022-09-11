import { PersonOff, AdminPanelSettings, Badge, Password } from "@mui/icons-material";
import { CardContent, List, ListItem, ListItemIcon, ListItemText, Switch, Button, CardActions, TextField, DialogActions, Dialog, DialogContent, DialogTitle, Stack, MenuItem, Select } from "@mui/material";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { DeactivateQuery } from "../../../query/DeactivateQuery";
import { EditUserQuery, EditUserQueryData } from "../../../query/EditUserQuery";
import { LoginContext } from "../../../storage/LoginInfo";
import { ReloadContext } from "../../../storage/Reloads";
import { User } from "../../../types/User";

enum Type {
	Normal = 'normal',
	Support = 'support',
	Bot = 'bot'
}

type UserData = {
	password: null | {
		password: string;
		logout: boolean;
	};
	displayName: string | null;
	avatar: string | null;
	deactivated: boolean;
	admin: boolean;
	userType: Type;
}

export function UserDetailsEdit(props: {user: User, disableTabs: (to: boolean) => void}) {

	const {t} = useTranslation();

	const {reloadUsers} = useContext(ReloadContext);

	const {homeserver, uid, token} = useContext(LoginContext);

	const defaultData: UserData = {
		password: null,
		displayName: props.user.displayname ? props.user.displayname : '',
		avatar: props.user.avatar_url,
		deactivated: props.user.deactivated === 1,
		admin: props.user.admin === 1,
		userType: props.user.user_type === null ? Type.Normal : (props.user.user_type === 'bot' ? Type.Bot : Type.Support)
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
			if(userData.displayName !== null) reqData['displayname'] = userData.displayName;
			if(userData.avatar) reqData['avatar_url'] = userData.avatar;
			if(defaultData.deactivated && !userData.deactivated) reqData['deactivated'] = false;
			const req = new EditUserQuery(homeserver, {
				uid: props.user.name,
				data: {
					...reqData,
					admin: userData.admin,
					user_type: userData.userType === null ? null : (userData.userType === 'bot' ? 'bot' : 'support')
				}
			}, token);
			if(!defaultData.deactivated && userData.deactivated){
				const disableReq = new DeactivateQuery(homeserver, {user: props.user.name}, token);
				await Promise.allSettled([disableReq.send(), req.send()]);
			} else await req.send();
			reloadUsers();
			toast.success(t('user.options.success'));
		} catch (e) {
			if (e instanceof Error) {
				const msg = handleCommonErrors(e);
				if (msg) toast.error(t(msg));
			}
		} finally {
			setQuerying(false);
			props.disableTabs(false);
		}
	}

	return (
		<>
		<CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
			<List>
				<ListItem secondaryAction={
					<Switch edge='end' checked={userData.deactivated} disabled={querying} onChange={() => setUserData({...userData, deactivated: !userData.deactivated})}/>
				}>
					<ListItemIcon>
						<PersonOff/>	
					</ListItemIcon>
					<ListItemText primary={t('user.options.deactivate.title')} secondary={t(`user.options.deactivate.desc${props.user.name === uid ? 'Self' : ''}`)}/>
				</ListItem>
				<ListItem secondaryAction={
					<Switch edge='end' checked={userData.admin} disabled={props.user.name === uid || querying} onChange={() => setUserData({...userData, admin: !userData.admin})} />
				}>
					<ListItemIcon>
						<AdminPanelSettings/>	
					</ListItemIcon>
					<ListItemText primary={t('user.options.admin.title')} secondary={t(`user.options.admin.desc${props.user.name === uid ? 'Self' : ''}`)}/>
				</ListItem>
				<ListItem>
					<ListItemIcon>
						<Badge/>	
					</ListItemIcon>
					<ListItemText primary={t('user.options.displayName.title')} secondary={t(`user.options.displayName.desc`)}/>
					<TextField variant='standard' value={userData.displayName} disabled={querying} onChange={e => setUserData({...userData, displayName: e.currentTarget.value})}/>
				</ListItem>
				<ListItem secondaryAction={
					<Button onClick={() => setOpen(true)}>{t('user.options.password.reset')}</Button>
				}>
					<ListItemIcon>
						<Password/>	
					</ListItemIcon>
					<ListItemText primary={t('user.options.password.title')} secondary={t(`user.options.password.desc`)}/>
				</ListItem>
				<ListItem secondaryAction={
					<Select label={t('user.types.type')} value={userData.userType} onChange={e => setUserData({...userData, userType: e.target.value as Type})} variant='standard'>
						<MenuItem value={Type.Normal}>{t('user.types.normal')}</MenuItem>
						<MenuItem value={Type.Bot}>{t('user.types.bot')}</MenuItem>
						<MenuItem value={Type.Support}>{t('user.types.support')}</MenuItem>
					</Select>
				}>
					<ListItemIcon>
						<Password/>	
					</ListItemIcon>
					<ListItemText primary={t('user.options.password.title')} secondary={t(`user.options.password.desc`)}/>
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