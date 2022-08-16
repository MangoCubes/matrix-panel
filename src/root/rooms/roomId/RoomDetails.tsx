import { Skeleton, Typography, Stack, Box, CardContent, CircularProgress, AppBar, Toolbar, Card, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Room } from "../../../types/Room";

enum TabName {
	Details = 'details',
	Members = 'members'
}

export function RoomDetails(props: {rooms: Room[] | null}){

	const [currentTab, setCurrentTab] = useState<TabName>(TabName.Details);
	const [disableTabs, setDisableTabs] = useState<boolean>(false);

	const {t} = useTranslation();

	const {rid} = useParams();

	const nav = useNavigate();

	const getTitle = () => {
		if(props.rooms === null) return <Skeleton sx={{width: '40%'}}/>;
		const r = props.rooms.find(r => r.room_id === rid);
		if (!r) {
			toast.error(t('room.invalidRoom'));
			nav('../');
			return false;
		} else return <Typography variant='h6'>{t('room.title', {name: r.room_id})}</Typography>
	}

	const getRoomDetails = () => {
		if(props.rooms === null) return (
			<Stack direction='row' spacing={2}>
				<Box>
					<Typography variant='h5' sx={{width: '128px'}}><Skeleton/></Typography>
					<Typography variant='h6' sx={{width: '128px'}}><Skeleton/></Typography>
					<Typography variant='caption' sx={{width: '128px'}}><Skeleton/></Typography>
				</Box>
			</Stack>
		)
		const r = props.rooms.find(r => r.room_id === rid);
		if (r) {
			return (
			<Stack direction='row' spacing={2}>
				<Box key='name'>
					{r.name && r.name !== '' ? <Typography variant='h5'>{r.name}</Typography> : <Typography variant='h5' color='GrayText'>{t('room.noName')}</Typography>}
					{r.canonical_alias && r.canonical_alias !== '' ? <Typography variant='h6'>{r.canonical_alias}</Typography> : <Typography variant='h6' color='GrayText'>{t('room.noAlias')}</Typography>}
					<Typography variant='caption' color='GrayText'>{r.room_id}</Typography>
				</Box>
			</Stack>
			);
		}
		else return false;
	}

	const getCurrentContent = () => {
		if(props.rooms === null) return (
			<CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
				<Box width='100%' textAlign='center'>
					<CircularProgress/>
				</Box>
			</CardContent>
		);
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
					{getRoomDetails()}
				</CardContent>
			</Card>
			<Card sx={{mt: 2, flex: 1, display: 'flex', flexDirection: 'column'}}>
				<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
					<Tabs value={currentTab} onChange={(e, s) => setCurrentTab(s)}>
						<Tab disabled={disableTabs || props.rooms === null} value={TabName.Details} label={t('room.details.title')}/>
					</Tabs>
				</Box>
				{getCurrentContent()}
			</Card>
		</Box>
	</Box>
	);
}