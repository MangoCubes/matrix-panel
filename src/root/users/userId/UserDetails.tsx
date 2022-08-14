import { Card, Skeleton, Typography, Box, AppBar, Toolbar, CardContent, Stack, Divider, CardActions, Button, Avatar } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { User } from "../../../types/User";

export function UserDetails(props: {users: User[] | null}){

	const [querying, setQuerying] = useState<boolean>(false);

	const {t} = useTranslation();

	const {uid} = useParams();

	const nav = useNavigate();

	const getTitle = () => {
		if(props.users === null) return <Skeleton sx={{width: '40%'}}/>;
		const u = props.users.find(u => u.name === uid);
		if (!u) {
			toast.error(t('user.invalidUser'));
			nav('../');
			return false;
		} else return <Typography variant='h6'>{t('user.title', {name: u.name})}</Typography>
	}

	const getUserDetails = () => {
		if(props.users === null) return (
			<Stack spacing={1}>
				<Skeleton variant='circular' width={64} height={64}/>
				<Box>
					<Typography variant='h6' sx={{width: '128'}}><Skeleton/></Typography>
					<Typography variant='caption' sx={{width: '128'}}><Skeleton/></Typography>
				</Box>
			</Stack>
		)
		const u = props.users.find(u => u.name === uid);
		if (u) {
			const items = [];
			if (u.avatar_url) items.push(<Avatar alt={u.displayname} src={u.avatar_url} sx={{ width: 64, height: 64 }} key='avatar'/>); //Fallback is not working for some reason
			else items.push(<Avatar alt={u.displayname} sx={{ width: 64, height: 64 }} key='avatar'>{u.displayname[0].toUpperCase()}</Avatar>);
			items.push(
				<Box key='name'>
					<Typography variant='h6'>{u.displayname}</Typography>
					<Typography variant='caption'>{u.name}</Typography>
				</Box>
			);
			return <Stack spacing={1}>{items}</Stack>;
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
						<Box width={256}>
							{getUserDetails()}
						</Box>
						<Box>
							123
						</Box>
					</Stack>
				</CardContent>
				<CardActions>
					<Button onClick={() => nav('../')}>{t('common.cancel')}</Button>
					<Button disabled={querying || props.users === null}>{t('common.save')}</Button>
				</CardActions>
			</Card>
		</Box>
	</Box>
	)
}