import { Skeleton, Typography, Box, AppBar, Toolbar } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { User } from "../../../types/User";

export function UserDetails(props: {users: User[] | null}){

	const {t} = useTranslation();

	const {uid} = useParams();

	const getTitle = () => {
		if(props.users === null) return <Skeleton sx={{width: '40%'}}/>;
		const u = props.users.find(u => u.name === uid);
		if (!u) {
			toast.error(t('user.invalidUser'));
			return <Navigate to='../'/>;
		} else return <Typography variant='h6'>{t('user.title', {name: u.name})}</Typography>
	}

	return (
	<Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
		<AppBar position='static'>
			<Toolbar>
				{getTitle()}
			</Toolbar>
		</AppBar>
		<Box m={2} sx={{flex: 1}}>
			
		</Box>
	</Box>
	)
}