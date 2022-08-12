import { getLoginInfo, LoginContext } from "../storage/LoginInfo";
import { Navigate } from "react-router";
import { MainPage } from "./MainPage";

export function FilterLogin(){
	const loginData = getLoginInfo();
	if(loginData){
		return (
			<LoginContext.Provider value={loginData}>
				<MainPage/>
			</LoginContext.Provider>
		);
	} else return <Navigate to='/login'/>
}