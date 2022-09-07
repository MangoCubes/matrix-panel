import { Key } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Typography, CardContent, Collapse, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, FormLabel, List, ListItem, ListItemIcon, ListItemText, Radio, RadioGroup, Stack, TextField, Button } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Moment } from "moment";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { GenerateUserTokenQuery } from "../../../query/GenerateUserTokenQuery";
import { LoginContext } from "../../../storage/LoginInfo";
import { User } from "../../../types/User";

export function UserActions(props: {user: User}){

	const {t} = useTranslation();
	const [open, setOpen] = useState(false);

	const {uid} = useContext(LoginContext);

	return (
		<CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
			<List>
				<ListItem>
					<ListItemIcon>
						<Key/>	
					</ListItemIcon>
					<ListItemText primary={t('user.actions.genToken.title')} secondary={t(props.user.name === uid ? `user.actions.genToken.cannotGenSelf` : `user.actions.genToken.desc`)}/>
					<Button disabled={props.user.name === uid} onClick={() => setOpen(true)}>{t('common.create')}</Button>
				</ListItem>
			</List>
			<TokenDialog user={props.user} open={open} close={() => setOpen(false)}/>
		</CardContent>
	);
}

enum Validity {
	Indef = 'Indef',
	Until = 'Until'
}

function TokenDialog(props: {user: User, open: boolean, close: () => void}){

	const {homeserver, token} = useContext(LoginContext);

	const [until, setUntil] = useState<Date | null>(null);
	const [validity, setValidity] = useState<Validity>(Validity.Indef);
	const [querying, setQuerying] = useState(false);
	const [userToken, setUserToken] = useState('');

	const {t} = useTranslation();

	const generate = async () => {
		setQuerying(true);
		try{
			const req = new GenerateUserTokenQuery(homeserver, {uid: props.user.name, valid_until_ms: until ? until.getDate() : undefined}, token);
			const res = await req.send();
			setUserToken(res.access_token);
		} catch (e) {
			if(e instanceof Error)handleCommonErrors(e, t);
		} finally {
			setQuerying(false);
		}
	}

	const validityText = () => {
		if(validity === Validity.Indef) return t('user.actions.genToken.descIndef');
		else return t('user.actions.genToken.descUntil');
	}

	return (
		<Dialog open={props.open} onClose={props.close}>
		<DialogTitle>{t(`user.actions.genToken.title`)}</DialogTitle>
		<DialogContent>
			<Stack spacing={1}>
				<Box>
					<FormControl>
						<FormLabel>{t('user.actions.genToken.expiry')}</FormLabel>
						<RadioGroup value={Validity.Indef} onChange={(e) => setValidity(e.target.value as Validity)}>
							<FormControlLabel value={Validity.Indef} control={<Radio checked={validity === Validity.Indef}/>} label={t('user.actions.genToken.indef')} />
							<FormControlLabel value={Validity.Until} control={<Radio checked={validity === Validity.Until}/>} label={t('user.actions.genToken.until')} />
							<Collapse unmountOnExit in={validity === Validity.Until}>
								<LocalizationProvider dateAdapter={AdapterMoment}>
									<DatePicker
										value={until}
										onChange={e => setUntil((e as unknown as Moment).toDate())} // Temporary fix
										renderInput={p => (
											<TextField {...p} variant='standard'/>
										)}
									/>
								</LocalizationProvider>
							</Collapse>
						</RadioGroup>
					</FormControl>
					<DialogContentText>{validityText()}</DialogContentText>
					<DialogContentText>{t('user.actions.genToken.expiryCond')}</DialogContentText>
				</Box>
				<Divider variant='middle'/>
				<Box>
					<DialogContentText>{t('user.actions.genToken.tokenHere')}</DialogContentText>
					<Typography>{userToken}</Typography>
					<LoadingButton loading={querying} onClick={generate}>{t('common.create')}</LoadingButton>
				</Box>
			</Stack>
		</DialogContent>
	</Dialog>
	)
}