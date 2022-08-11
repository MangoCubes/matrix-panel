import { useNavigate } from "react-router-dom";
import { MissingTokenError } from "../class/error/MissingTokenError";
import { AccessToken } from "../types/Types";

export function getToken(){
	const nav = useNavigate();
	const token = sessionStorage.getItem('token');
	if(!token) {
		nav('/');
		throw new MissingTokenError();
	}
	return token as AccessToken;
}

export function setToken(token: string | AccessToken){
	sessionStorage.setItem('token', token);
}