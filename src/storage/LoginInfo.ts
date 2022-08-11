import { useNavigate } from "react-router-dom";
import { MissingTokenError } from "../class/error/MissingTokenError";
import { AccessToken, UserID } from "../types/Types";

export type LoginData = {
	homeserver: string;
    token: AccessToken;
    uid: UserID;
}

export function getLoginInfo(): LoginData{
	const nav = useNavigate();
	const token = sessionStorage.getItem('token');
	const homeserver = sessionStorage.getItem('homeserver');
	const uid = sessionStorage.getItem('uid');
	if(!token || !homeserver || !uid) {
		nav('/');
		throw new MissingTokenError();
	}
	return {
		homeserver: homeserver,
		uid: uid as UserID,
		token: token as AccessToken
	}
}

export function setToken(data: LoginData){
	sessionStorage.setItem('token', data.token);
	sessionStorage.setItem('homeserver', data.homeserver);
	sessionStorage.setitem('uid', data.uid);
}