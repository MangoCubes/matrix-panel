import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next"
import handleCommonErrors from "../../functions/handleCommonErrors";
import { LoginQuery } from "../../query/LoginQuery";
import { Homeserver, UserID } from "../../types/Types";

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
		try{
			const req = new LoginQuery(homeserver as Homeserver, {uid: username as UserID, password: password}, null);
			const res = await req.send();
			console.log(res);
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
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