import { Key } from "@mui/icons-material";
import { Button, CardContent, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, List, ListItem, ListItemIcon, ListItemText, Radio, RadioGroup, TextField } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Moment } from "moment";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { User } from "../../../types/User";

export function UserActions(props: {user: User}){

	const {t} = useTranslation();
	const [open, setOpen] = useState(false);

	return (
		<CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
			<List>
				<ListItem>
					<ListItemIcon>
						<Key/>	
					</ListItemIcon>
					<ListItemText primary={t('user.actions.genToken.title')} secondary={t(`user.actions.genToken.desc`)}/>
					<Button onClick={() => setOpen(true)}>{t('common.create')}</Button>
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

	const [until, setUntil] = useState<Date | null>(null);
	const [validity, setValidity] = useState<Validity>(Validity.Indef);
	const [querying, setQuerying] = useState(false);
	const [userToken, setUserToken] = useState('');

	const {t} = useTranslation();

	const generate = async () => {
		setQuerying(true);
		try{
			props.close();
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
			<DialogContentText>{t('user.actions.genToken.tokenHere')}</DialogContentText>
			<Button onClick={generate} disabled={querying}>{t('common.create')}</Button>
		</DialogContent>
	</Dialog>
	)
}