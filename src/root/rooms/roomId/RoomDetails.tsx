import { Skeleton, Typography, Box, AppBar, Toolbar } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Room } from "../../../types/Room";

export function RoomDetails(props: {rooms: Room[] | null}){

	const {t} = useTranslation();

	const {rid} = useParams();

	const getTitle = () => {
		if(props.rooms === null) return <Skeleton sx={{width: '40%'}}/>;
		const r = props.rooms.find(r => r.room_id === rid);
		if (!r) {
			toast.error(t('room.invalidRoom'));
			return <Navigate to='../'/>;
		} else return <Typography variant='h6'>{t('room.title', {name: r.canonical_alias ? r.canonical_alias : r.room_id})}</Typography>
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