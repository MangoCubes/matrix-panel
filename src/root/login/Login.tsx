import { Box, Typography, TextField, Button, Stack } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next"

export function Login () {

	const {t} = useTranslation();

	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [homeserver, setHomeserver] = useState('');
	
	const login = () => {
		
	}

	return (
		<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} mt={16}>
			<Typography variant='h5'>{t('login.title')}</Typography>
			<Stack component='form' onSubmit={login} spacing={2}>
				<TextField required variant='standard' label={t('login.homeserver')} value={homeserver} onChange={(e) => setHomeserver(e.currentTarget.value)}/>
				<TextField required variant='standard' label={t('login.username')} autoFocus value={username} onChange={(e) => setUsername(e.currentTarget.value)}/>
				<TextField required variant='standard' label={t('login.password')} type='password' value={password} onChange={(e) => setPassword(e.currentTarget.value)}/>
				<Button type='submit' fullWidth>{t('login.login')}</Button>
			</Stack>
		</Box>
	)
}