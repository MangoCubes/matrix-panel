import { Card, Skeleton, Typography, Box, AppBar, Toolbar, CardContent, Stack, Divider, CardActions, Button, Avatar } from "@mui/material";
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

	const getAvatar = () => {
		if(props.users === null) return <Skeleton variant='circular' width={64} height={64}/>;
		const u = props.users.find(u => u.name === uid);
		if (u) {
			if (u.avatar_url) return <Avatar alt={u.displayname} src={u.avatar_url} sx={{ width: 64, height: 64 }}/>; //Fallback is not working for some reason
			else return <Avatar alt={u.displayname} sx={{ width: 64, height: 64 }}>{u.displayname.toUpperCase()[0]}</Avatar>;
		}
		else return false;
	}

	return (
	<Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
		<AppBar position='static'>
			<Toolbar>
				{getTitle()}
			</Toolbar>
		</AppBar>
		<Box m={2} sx={{flex: 1}}>
			<Card>
				<CardContent>
					<Stack direction='row' justifyContent='flex-start' alignItems='center' spacing={1} divider={<Divider variant='middle' orientation='vertical' flexItem />}>
						<Box>
							{getAvatar()}
						</Box>
						<Box>
							123
						</Box>
					</Stack>
				</CardContent>
				<CardActions>
					<Button>{t('common.cancel')}</Button>
					<Button>{t('common.save')}</Button>
				</CardActions>
			</Card>
		</Box>
	</Box>
	)
}