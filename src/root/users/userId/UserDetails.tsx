import { Card, Skeleton, Typography, Box, AppBar, Toolbar, CardContent, Stack, Tabs, Avatar, Tab, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { User } from "../../../types/User";
import { UserDetailsEdit } from "./UserDetailsEdit";
import { UserDevices } from "./UserDevices";

enum TabName {
	Details = 'details',
	Sessions = 'sessions',
	Devices = 'devices',
	Rooms = 'rooms'
}

export function UserDetails(props: {users: User[] | null}){

	const [currentTab, setCurrentTab] = useState<TabName>(TabName.Details);
	const [disableTabs, setDisableTabs] = useState<boolean>(false);

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
			<Stack direction='row' spacing={2}>
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
			return <Stack direction='row' spacing={2}>{items}</Stack>;
		}
		else return false;
	}

	const getCurrentContent = () => {
		if(props.users === null) return (
			<CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
				<Box width='100%' textAlign='center'>
					<CircularProgress/>
				</Box>
			</CardContent>
		);
		const user = props.users.find(u => u.name === uid);
		if(!user) return false;
		if(currentTab === TabName.Details) return <UserDetailsEdit user={user} disableTabs={setDisableTabs}/>;
		else if(currentTab === TabName.Devices) return <UserDevices user={user}/>;
		else return <Box sx={{flex: 1}}></Box>;
	}

	return (
	<Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
		<AppBar position='static'>
			<Toolbar>
				{getTitle()}
			</Toolbar>
		</AppBar>
		<Box m={2} sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
			<Card>
				<CardContent>
					{getUserDetails()}
				</CardContent>
			</Card>
			<Card sx={{mt: 2, flex: 1, display: 'flex', flexDirection: 'column'}}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs value={currentTab} onChange={(e, s) => setCurrentTab(s)}>
						<Tab disabled={disableTabs || props.users === null} value={TabName.Details} label={t('user.details.title')}/>
						<Tab disabled={disableTabs || props.users === null} value={TabName.Sessions} label={t('user.sessions.title')}/>
						<Tab disabled={disableTabs || props.users === null} value={TabName.Devices} label={t('user.devices.title')}/>
						<Tab disabled={disableTabs || props.users === null} value={TabName.Rooms} label={t('user.rooms.title')}/>
					</Tabs>
				</Box>
				{getCurrentContent()}
			</Card>
		</Box>
	</Box>
	)
}