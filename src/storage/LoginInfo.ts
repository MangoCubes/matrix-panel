import { MissingTokenError } from "../class/error/MissingTokenError";
import { AccessToken, FullUserID } from "../types/Types";

export type LoginData = {
	homeserver: string;
    token: AccessToken;
    uid: FullUserID;
}

export function getLoginInfo(): LoginData{
	const token = sessionStorage.getItem('token');
	const homeserver = sessionStorage.getItem('homeserver');
	const uid = sessionStorage.getItem('uid');
	if(!token || !homeserver || !uid) throw new MissingTokenError();
	return {
		homeserver: homeserver,
		uid: uid as FullUserID,
		token: token as AccessToken
	}
}

export function setLoginInfo(data: LoginData){
	sessionStorage.setItem('token', data.token);
	sessionStorage.setItem('homeserver', data.homeserver);
	sessionStorage.setItem('uid', data.uid);
}