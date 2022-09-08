import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

export function ConfirmationPopup(props: {open: boolean, cancel: () => void, confirm: () => void, title: string, body: string}){

	const {t} = useTranslation();

	const onClick = () => {
		props.cancel();
		props.confirm();
	}

	return (
		<Dialog open={props.open} onClose={props.cancel}>
			<DialogTitle>{props.title}</DialogTitle>
			<DialogContent>
				<DialogContentText>{props.body}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={props.cancel}>{t('common.cancel')}</Button>
				<Button onClick={onClick} disabled={!props.open}>{t('common.confirm')}</Button>
			</DialogActions>
		</Dialog>
	)
}