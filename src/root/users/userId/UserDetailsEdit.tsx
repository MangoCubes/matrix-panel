import { FormControl, FormGroup, FormControlLabel, Switch, FormHelperText, CardContent } from "@mui/material";
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
			<FormControl variant='standard'>
				<FormGroup>
					<FormControlLabel control={<Switch checked={deactivated.value} onChange={() => {}}/>} disabled={deactivated.loading} label={t('user.details.deactivate')}/>
					<FormControlLabel control={<Switch checked={admin.value} disabled={props.user.name === uid || admin.loading} onChange={toggleAdmin}/>} label={t('user.details.admin')}/>
					{props.user.name === uid && <FormHelperText>{t('user.details.cannotDemoteSelf')}</FormHelperText>}
				</FormGroup>
			</FormControl>
		</CardContent>
	);
}