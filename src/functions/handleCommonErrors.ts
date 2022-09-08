import { HTTPError } from "../class/error/HTTPError";
import { MissingTokenError } from "../class/error/MissingTokenError";

export default function handleCommonErrors(e: Error){

	if(e instanceof HTTPError){
		if(e.errCode === 404 || e.errCode === 400 || e.errCode === 429 || e.errCode === 403) return `error.${e.errCode}`;
		else return 'error.unknownRes';
	} else if(e instanceof MissingTokenError) return 'error.missingToken';
	else if(e instanceof DOMException){
		if(e.name === 'AbortError') return null;
		else return 'error.timeout';
	}
	else return `error.unknown`;
}