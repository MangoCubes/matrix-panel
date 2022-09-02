import { AdminPanelSettings, Password, PersonOff } from "@mui/icons-material";
import { Switch, CardContent, List, ListItem, ListItemIcon, ListItemText, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { DeactivateQuery } from "../../../query/DeactivateQuery";
import { EditUserQuery } from "../../../query/EditUserQuery";
import { Query, QueryType } from "../../../query/Query";
import { ToggleAdminQuery } from "../../../query/ToggleAdminQuery";
import { LoginContext } from "../../../storage/LoginInfo";
import { User } from "../../../types/User";

type PromiseBoolean = {
	loading: boolean;
	value: boolean;
}

export function UserDetailsEdit(props: {user: User, disableTabs: (to: boolean) => void}) {

	const {t} = useTranslation();

	const {homeserver, uid, token} = useContext(LoginContext);

	const [deactivated, setDeactivated] = useState<PromiseBoolean>({value: props.user.deactivated === 1, loading: false});
	const [admin, setAdmin] = useState<PromiseBoolean>({value: props.user.admin === 1, loading: false});
	const [open, setOpen] = useState(false);

	const toggleAdmin = async () => {
		const original = admin.value;
		try{
			setAdmin({value: !original, loading: true});
			const req = new ToggleAdminQuery(homeserver, {to: !original, user: props.user.name}, token);
			await req.send();
			setAdmin({value: !original, loading: false});
			toast.success(t(`user.details.admin.admin${original ? 'Dis' : 'En'}ableSuccess`));
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
			setAdmin({value: original, loading: false});
		}
	}
	
	const activateAccount = async (pw: string) => {
		try{
			setDeactivated({value: false, loading: true});
			const req = new EditUserQuery(homeserver, {uid: props.user.name, data: {deactivated: false, password: pw}}, token);
			await req.send();
			setDeactivated({value: false, loading: false});
			toast.success(t('user.details.deactivate.activateSuccess'));
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
			setDeactivated({value: true, loading: false});
		} finally {
			setOpen(false);
		}
	}

	const deactivateAccount = async () => {
		try{
			setDeactivated({value: true, loading: true});
			const req = new DeactivateQuery(homeserver, {user: props.user.name}, token);
			await req.send();
			setDeactivated({value: true, loading: false});
			toast.success(t('user.details.deactivate.deactivateSuccess'));
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
			setDeactivated({value: false, loading: false});
		}
	}

	const clickToggle = () => {
		if(deactivated.value) setOpen(true);
		else deactivateAccount();
	}

	useEffect(() => {
		props.disableTabs(admin.loading || deactivated.loading);
	}, [deactivated, admin]);

	return (
		<CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
			<List>
				<ListItem>
					<ListItemIcon>
						<PersonOff/>	
					</ListItemIcon>
					<ListItemText primary={t('user.details.deactivate.title')} secondary={t('user.details.deactivate.desc')}/>
					<Switch edge='end' checked={deactivated.value} disabled={props.user.name === uid || deactivated.loading} onChange={clickToggle}/>
					<PasswordDialog user={props.user} open={open} close={() => setOpen(false)} confirm={activateAccount} querying={deactivated.loading}/>
				</ListItem>
				<ListItem>
					<ListItemIcon>
						<AdminPanelSettings/>	
					</ListItemIcon>
					<ListItemText primary={t('user.details.admin.title')} secondary={t(`user.details.admin.desc${props.user.name === uid ? 'Self' : ''}`)}/>
					<Switch edge='end' checked={admin.value} disabled={props.user.name === uid || admin.loading} onChange={toggleAdmin} />
				</ListItem>
			</List>
		</CardContent>
	);
}

function PasswordDialog(props: {user: User, open: boolean, close: () => void, confirm: (pw: string) => void, querying: boolean}){

	const [password, setPassword] = useState('');

	const {t} = useTranslation();

	return (
		<Dialog open={props.open} onClose={props.close}>
			<DialogTitle>{t('user.details.password.title', {uid: props.user.name})}</DialogTitle>
			<DialogContent>
				<TextField
					variant='standard'
					value={password}
					disabled={props.querying}
					onChange={(e) => setPassword(e.currentTarget.value)}
					label={t('user.details.password.password')}
				/>
			</DialogContent>
			<DialogActions>
				<Button disabled={password.length === 0 || props.querying} onClick={() => props.confirm(password)}>{t('common.confirm')}</Button>
			</DialogActions>
		</Dialog>
	)
}