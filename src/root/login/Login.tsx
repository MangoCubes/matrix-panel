import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify";
import { HTTPError } from "../../class/error/HTTPError";
import handleCommonErrors from "../../functions/handleCommonErrors";
import { IsAdminQuery } from "../../query/IsAdminQuery";
import { LoginQuery } from "../../query/LoginQuery";
import { UserID } from "../../types/Types";

const preset = process.env.REACT_APP_HOMESERVER && process.env.REACT_APP_HOMESERVER !== '' ? process.env.REACT_APP_HOMESERVER : null;

export function Login () {

	const {t} = useTranslation();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [homeserver, setHomeserver] = useState(preset === null ? '': preset);
	const [querying, setQuerying] = useState<boolean>(false);
	
	const login = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setQuerying(true);
		let auth = false;
		try{
			const loginReq = new LoginQuery(homeserver, {uid: username as UserID, password: password}, null);
			const loginRes = await loginReq.send();
			auth = true;
			const isAdminReq = new IsAdminQuery(homeserver, {uid: loginRes.user_id}, loginRes.access_token);
			const isAdminRes = await isAdminReq.send();
			
		} catch (e) {
			const locallyHandled = [403]
			if (e instanceof Error) {
				if(e instanceof HTTPError && locallyHandled.includes(e.errCode)){
					if(e.errCode === 403) {
						if (auth) toast.error(t('login.notAdmin'));
						else toast.error(t('login.wrong'));
					}
					return;
				}
				handleCommonErrors(e, t);
			}
		} finally {
			setQuerying(false);
		}
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} mt={16}>
			<Typography variant='h5'>{t('login.title')}</Typography>
			<Stack component='form' onSubmit={login} spacing={2}>
				<TextField required variant='standard' disabled={preset !== null} label={t('login.homeserver')} value={homeserver} onChange={(e) => setHomeserver(e.currentTarget.value)}/>
				<TextField required variant='standard' label={t('login.username')} autoFocus value={username} onChange={(e) => setUsername(e.currentTarget.value)}/>
				<TextField required variant='standard' label={t('login.password')} type='password' value={password} onChange={(e) => setPassword(e.currentTarget.value)}/>
				<Button type='submit' fullWidth>{t('login.login')}</Button>
			</Stack>
		</Box>
	)
}