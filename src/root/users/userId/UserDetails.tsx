import { Card, Skeleton, Typography, Box, AppBar, Toolbar, CardContent, Stack, Tabs, Avatar, Tab } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { User } from "../../../types/User";

enum TabName {
	Details = 'details',
	Sessions = 'sessions'
}

export function UserDetails(props: {users: User[] | null}){

	const [querying, setQuerying] = useState<boolean>(false);
	const [currentTab, setCurrentTab] = useState<TabName>(TabName.Details);

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
			<Stack direction='row' spacing={1}>
				<Skeleton variant='circular' width={64} height={64}/>
				<Box>
					<Typography variant='h6' sx={{width: '128px'}}><Skeleton/></Typography>
					<Typography variant='caption' sx={{width: '128px'}}><Skeleton/></Typography>
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
			return <Stack direction='row' spacing={1}>{items}</Stack>;
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
					{getUserDetails()}
				</CardContent>
			</Card>
			<Card sx={{mt: 2}}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs value={currentTab} onChange={(e, s) => setCurrentTab(s)}>
						<Tab value={TabName.Details} label={t('user.details')}/>
						<Tab value={TabName.Sessions} label={t('user.sessions')}/>
					</Tabs>
				</Box>
				<CardContent>
					123
				</CardContent>
			</Card>
		</Box>
	</Box>
	)
}