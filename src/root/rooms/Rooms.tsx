import { Refresh } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridColumns, GridValueFormatterParams } from "@mui/x-data-grid";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Room } from "../../types/Room";

type MemberCount = {
	all: number;
	local: number;
}

export function Rooms(props: {rooms: Room[] | null, reload: () => void}){

	const {t} = useTranslation();

	const nav = useNavigate();

	const columns = useMemo<GridColumns>(
		() => [
			{field: 'id', headerName: t('rooms.roomId'), flex: 4},
			{field: 'alias', headerName: t('rooms.alias'), flex: 2},
			{field: 'encryption', type: 'boolean', headerName: t('rooms.encryption')},
			{field: 'creator', headerName: t('rooms.creator'), flex: 4},
			{field: 'roomType', headerName: t('rooms.roomType'), flex: 2},
			{field: 'members', headerName: t('rooms.members'), valueFormatter: (params: GridValueFormatterParams<MemberCount>) => {
				if (params.value == null) return '';
				else return `${params.value.all} (${params.value.local})`
			}, flex: 2},
			{field: 'isSpace', type: 'boolean', headerName: t('rooms.isSpace')},
		],
		[]
	);

	const getRows = () => {
		if(props.rooms === null) return [];
		const rows = [];
		for(const r of props.rooms){
			rows.push({
				id: r.room_id,
				alias: r.canonical_alias,
				encryption: r.encryption !== null,
				creator: r.creator,
				roomType: r.join_rules,
				members: {
					all: r.joined_members,
					local: r.joined_local_members
				},
				isSpace: r.room_type === 'm.space'
			});
		}
		return rows;
	}

	useEffect(() => {
		props.reload();
	}, []);

	return (
		<Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
			<AppBar position='static'>
				<Toolbar>
					<Typography variant='h6'>{t('rooms.title')}</Typography>
					<Box sx={{flex: 1}}/>
					<Tooltip title={t('common.reload')}>
						<span>
							<IconButton edge='end' onClick={props.reload} disabled={props.rooms === null}>
								<Refresh/>
							</IconButton>
						</span>
					</Tooltip>
				</Toolbar>
			</AppBar>
			<Box m={2} sx={{flex: 1}}>
				<DataGrid columns={columns} rows={getRows()} loading={props.rooms === null} onRowClick={(p) => nav(`${p.id}`)}/>
			</Box>
		</Box>
	);
}