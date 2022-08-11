import { TFunction } from "react-i18next";
import { toast } from "react-toastify";
import { HTTPError } from "../class/error/HTTPError";
import { MissingTokenError } from "../class/error/MissingTokenError";

export default function handleCommonErrors(e: Error, t: TFunction){

	if(e instanceof HTTPError){
		if(e.errCode === 404 || e.errCode === 400 || e.errCode === 429) toast.error(t(`error.${e.errCode}`));
		else toast.error(t('error.unknown'));
		return;
	} else if(e instanceof MissingTokenError){
		toast.error(t('error.missingToken'));
		return;
	} else if(e instanceof DOMException){
		if(e.name === 'AbortError') {
			toast.error(t('error.timeout'));
			return;
		}
	}
	else toast.error(t(`error.unknown`));
}