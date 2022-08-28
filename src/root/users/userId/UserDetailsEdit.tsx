import { AdminPanelSettings, PersonOff } from "@mui/icons-material";
import { FormControl, FormGroup, FormControlLabel, Switch, FormHelperText, CardContent, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import handleCommonErrors from "../../../functions/handleCommonErrors";
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

	const toggleAdmin = async () => {
		const original = admin.value;
		try{
			setAdmin({value: !original, loading: true});
			const req = new ToggleAdminQuery(homeserver, {to: !original, user: props.user.name}, token);
			await req.send();
			setAdmin({value: !original, loading: false});
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
			setAdmin({value: original, loading: false});
		}
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
					<Switch edge='end' checked={deactivated.value} onChange={() => {}}/>
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