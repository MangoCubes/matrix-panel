import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

export function ConfirmationPopup(props: {open: boolean, cancel: () => void, confirm: () => void, title: string, body: string}){

	const {t} = useTranslation();

	return (
		<Dialog open={props.open}>
			<DialogTitle>{props.title}</DialogTitle>
			<DialogContent>
				<DialogContentText>{props.body}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={props.cancel}>{t('common.cancel')}</Button>
				<Button onClick={props.confirm}>{t('common.confirm')}</Button>
			</DialogActions>
		</Dialog>
	)
}