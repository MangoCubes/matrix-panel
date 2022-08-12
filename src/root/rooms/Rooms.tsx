import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { DataGrid, GridColumns } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Room } from "../../types/Room";

export function Rooms(props: {rooms: Room[], loading: boolean}){

	const {t} = useTranslation();

	const columns = useMemo<GridColumns>(
		() => [
			{field: 'id', headerName: t('rooms.roomId')},
			{field: 'alias', headerName: t('rooms.alias')},
			{field: 'encryption', type: 'boolean', headerName: t('rooms.encryption')},
			{field: 'creator', headerName: t('rooms.creator')},
			{field: 'roomType', headerName: t('rooms.roomType')},
			{field: 'members', headerName: t('rooms.members')},
			{field: 'isSpace', type: 'boolean', headerName: t('rooms.isSpace')},
		],
		[]
	);

	const getRows = () => {
		const rows = [];
		for(const r of props.rooms){
			rows.push({
				id: r.room_id,
				alias: r.canonical_alias,
				encryption: r.encryption !== null,
				creator: r.creator,
				roomType: r.join_rules,
				members: r.joined_members,
				isSpace: r.room_type === 'm.space'
			});
		}
		return rows;
	}

	return (
		<Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
			<AppBar position='static'>
				<Toolbar>
					<Typography variant='h6'>{t('rooms.title')}</Typography>
				</Toolbar>
			</AppBar>
			<Box m={2} sx={{flex: 1}}>
				<DataGrid columns={columns} rows={getRows()} loading={props.loading}/>
			</Box>
		</Box>
	);
}