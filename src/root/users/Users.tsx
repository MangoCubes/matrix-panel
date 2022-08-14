import { Edit, Refresh } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColumns, GridRowParams, GridValueFormatterParams } from "@mui/x-data-grid";
import { useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../storage/LoginInfo";
import { User } from "../../types/User";
export function Users(props: {users: User[] | null, reload: () => void}){

	const {t} = useTranslation();

	const nav = useNavigate();

	const {uid} = useContext(LoginContext);

	const columns = useMemo<GridColumns>(
		() => [
			{field: 'uid', headerName: t('users.userId'), flex: 2},
			{field: 'displayName', headerName: t('users.displayName'), flex: 2},
			{type: 'boolean', field: 'isAdmin', headerName: t('users.isAdmin')},
			{type: 'boolean', field: 'isGuest', headerName: t('users.isGuest')},
			{type: 'boolean', field: 'deactivated', headerName: t('users.deactivated')},
			{type: 'boolean', field: 'shadowBanned', headerName: t('users.shadowBanned')},
			{field: 'regDate', headerName: t('users.regDate'), valueFormatter: (params: GridValueFormatterParams<number>) => {
				if (params.value == null) return '';
				else return new Date(params.value).toLocaleString()
			}, flex: 2},
			{field: 'actions', type: 'actions', getActions: (p: GridRowParams) => [
				<GridActionsCellItem icon={<Edit/>} onClick={() => nav(`${p.id}`)} label={t('common.edit')}/>,
			]}
		],
		[]
	);

	const getRows = () => {
		if(!props.users) return [];
		const rows = [];
		for(const r of props.users){
			rows.push({
				id: r.name,
				uid: r.name === uid ? `${r.name} ${t('users.you')}` : r.name,
				displayName: r.displayname,
				isAdmin: r.admin === 1,
				isGuest: r.is_guest === 1,
				deactivated: r.deactivated === 1,
				regDate: r.creation_ts,
				shadowBanned: r.shadow_banned
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
					<Typography variant='h6'>{t('users.title')}</Typography>
					<Box sx={{flex: 1}}/>
					<Tooltip title={t('common.reload')} key='reload'>
						<span>
							<IconButton onClick={props.reload} disabled={props.users === null}>
								<Refresh/>
							</IconButton>
						</span>
					</Tooltip>
				</Toolbar>
			</AppBar>
			<Box m={2} sx={{flex: 1}}>
				<DataGrid
					columns={columns}
					rows={getRows()}
					loading={props.users === null}
				/>
			</Box>
		</Box>
	);
}