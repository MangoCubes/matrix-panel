import { AdminPanelSettings, PersonOff, Badge } from "@mui/icons-material";
import { Switch, CardContent, List, ListItem, ListItemIcon, ListItemText, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { DeactivateQuery } from "../../../query/DeactivateQuery";
import { EditUserQuery } from "../../../query/EditUserQuery";
import { ToggleAdminQuery } from "../../../query/ToggleAdminQuery";
import { LoginContext } from "../../../storage/LoginInfo";
import { User } from "../../../types/User";

type PromiseBoolean = {
	loading: boolean;
	value: boolean;
}

enum DialogType {
	None,
	Password,
	Name
}

export function UserDetailsEdit(props: {user: User, disableTabs: (to: boolean) => void}) {

	const {t} = useTranslation();

	const {homeserver, uid, token} = useContext(LoginContext);

	const [deactivated, setDeactivated] = useState<PromiseBoolean>({value: props.user.deactivated === 1, loading: false});
	const [admin, setAdmin] = useState<PromiseBoolean>({value: props.user.admin === 1, loading: false});
	const [open, setOpen] = useState<DialogType>(DialogType.None);

	const toggleAdmin = async () => {
		const original = admin.value;
		try{
			setAdmin({value: !original, loading: true});
			const req = new ToggleAdminQuery(homeserver, {to: !original, user: props.user.name}, token);
			await req.send();
			setAdmin({value: !original, loading: false});
			toast.success(t(`user.options.admin.admin${original ? 'Dis' : 'En'}ableSuccess`));
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
			toast.success(t('user.options.deactivate.activateSuccess'));
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
			setDeactivated({value: true, loading: false});
		} finally {
			setOpen(DialogType.None);
		}
	}

	const deactivateAccount = async () => {
		try{
			setDeactivated({value: true, loading: true});
			const req = new DeactivateQuery(homeserver, {user: props.user.name}, token);
			await req.send();
			setDeactivated({value: true, loading: false});
			toast.success(t('user.options.deactivate.deactivateSuccess'));
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
			setDeactivated({value: false, loading: false});
		}
	}

	const clickToggle = () => {
		if(deactivated.value) setOpen(DialogType.Password);
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
					<ListItemText primary={t('user.options.deactivate.title')} secondary={t('user.options.deactivate.desc')}/>
					<Switch edge='end' checked={deactivated.value} disabled={props.user.name === uid || deactivated.loading} onChange={clickToggle}/>
				</ListItem>
				<ListItem>
					<ListItemIcon>
						<AdminPanelSettings/>	
					</ListItemIcon>
					<ListItemText primary={t('user.options.admin.title')} secondary={t(`user.options.admin.desc${props.user.name === uid ? 'Self' : ''}`)}/>
					<Switch edge='end' checked={admin.value} disabled={props.user.name === uid || admin.loading} onChange={toggleAdmin} />
				</ListItem>
				<ListItem>
					<ListItemIcon>
						<Badge/>	
					</ListItemIcon>
					<ListItemText primary={t('user.options.displayName.title')} secondary={t(`user.options.displayName.desc`)}/>
					<Button>{t('common.edit')}</Button>
				</ListItem>
			</List>
			<InputDialog user={props.user} type={open} close={() => setOpen(DialogType.None)} confirm={activateAccount} querying={deactivated.loading}/>
		</CardContent>
	);
}

function InputDialog(props: {user: User, type: DialogType, close: () => void, confirm: (pw: string) => void, querying: boolean}){

	const [value, setValue] = useState('');

	const {t} = useTranslation();

	const title = {
		[DialogType.None]: '',
		[DialogType.Password]: t('user.options.password.title', {uid: props.user.name}),
		[DialogType.Name]: t('user.options.displayName.title')
	}

	const label = {
		[DialogType.None]: '',
		[DialogType.Password]: t('user.options.password.password'),
		[DialogType.Name]: t('user.options.displayName.displayName')
	}

	return (
		<Dialog open={props.type !== DialogType.None} onClose={props.close}>
			<DialogTitle>{title[props.type]}</DialogTitle>
			<DialogContent>
				<TextField
					variant='standard'
					value={value}
					disabled={props.querying}
					onChange={(e) => setValue(e.currentTarget.value)}
					label={label[props.type]}
				/>
			</DialogContent>
			<DialogActions>
				<Button disabled={value.length === 0 || props.querying} onClick={() => props.confirm(value)}>{t('common.confirm')}</Button>
			</DialogActions>
		</Dialog>
	)
}