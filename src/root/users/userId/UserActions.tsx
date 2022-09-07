import { Campaign, Key } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Box, Typography, CardContent, Collapse, Dialog, DialogContent, DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, FormLabel, List, ListItem, ListItemIcon, ListItemText, Radio, RadioGroup, Stack, TextField, Button, DialogActions } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Moment } from "moment";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { HTTPError } from "../../../class/error/HTTPError";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { GenerateUserTokenQuery } from "../../../query/GenerateUserTokenQuery";
import { SendNoticeQuery } from "../../../query/SendNoticeQuery";
import { LoginContext } from "../../../storage/LoginInfo";
import { User } from "../../../types/User";

enum DialogType {
	None,
	Token,
	Notice
}

export function UserActions(props: {user: User}){

	const {t} = useTranslation();
	const [open, setOpen] = useState(DialogType.None);

	const {uid} = useContext(LoginContext);

	return (
		<CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
			<List>
				<ListItem>
					<ListItemIcon>
						<Key/>	
					</ListItemIcon>
					<ListItemText primary={t('user.actions.genToken.title')} secondary={t(props.user.name === uid ? `user.actions.genToken.cannotGenSelf` : `user.actions.genToken.desc`)}/>
					<Button disabled={props.user.name === uid} onClick={() => setOpen(DialogType.Token)}>{t('common.create')}</Button>
				</ListItem>
			</List>
			<List>
				<ListItem>
					<ListItemIcon>
						<Campaign/>	
					</ListItemIcon>
					<ListItemText primary={t('user.actions.notice.title')} secondary={t(`user.actions.notice.desc`)}/>
					<Button onClick={() => setOpen(DialogType.Notice)}>{t('common.send')}</Button>
				</ListItem>
			</List>
			<TokenDialog user={props.user} open={open === DialogType.Token} close={() => setOpen(DialogType.None)}/>
			<NoticeDialog user={props.user} open={open === DialogType.Notice} close={() => setOpen(DialogType.None)}/>
		</CardContent>
	);
}

function NoticeDialog(props: {user: User, open: boolean, close: () => void}){

	const {homeserver, token} = useContext(LoginContext);

	const [querying, setQuerying] = useState(false);
	const [message, setMessage] = useState('');

	const {t} = useTranslation();

	useEffect(() => {
		return () => setMessage('');
	}, []);

	const send = async () => {
		setQuerying(true);
		try{
			const req = new SendNoticeQuery(homeserver, {uid: props.user.name, message: message}, token);
			await req.send();
			toast.success(t('user.actions.notice.success'));
			props.close();
		} catch (e) {
			const locallyHandled = [400];
			if (e instanceof Error) {
				if(e instanceof HTTPError && locallyHandled.includes(e.errCode)){
					if(e.errCode === 400) toast.error(t('user.actions.notice.notEnabled'));
					return;
				}
				handleCommonErrors(e, t);
			}
		} finally {
			setQuerying(false);
		}
	}

	return (
		<Dialog open={props.open} onClose={props.close}>
			<DialogTitle>{t(`user.actions.notice.dialog.title`)}</DialogTitle>
			<DialogContent>
				<TextField value={message} onChange={e => setMessage(e.currentTarget.value)} disabled={querying} variant='standard' label={t('user.actions.notice.dialog.label')}/>
			</DialogContent>
			<DialogActions>
				<Button onClick={send} disabled={message === '' || querying}>{t('common.send')}</Button>
			</DialogActions>
		</Dialog>
	)
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