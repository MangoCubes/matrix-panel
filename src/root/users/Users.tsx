import { Edit, Refresh } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColumns, GridRowParams, GridSelectionModel, GridValueFormatterParams } from "@mui/x-data-grid";
import { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../storage/LoginInfo";
import { User } from "../../types/User";
import { PseudoBooleanPropNames } from "../../types/Utils";

enum Tristate {
	True,
	False,
	Mixed
}

export function Users(props: {users: User[] | null, reload: () => void}){

	const {t} = useTranslation();

	const nav = useNavigate();

	const {uid} = useContext(LoginContext);
	
	const [sel, setSel] = useState<GridSelectionModel>([]);

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

	const checkMix = (list: User[], key: PseudoBooleanPropNames<User>) => {
		let current: 0 | 1 | null = null;
		for(const u of list){
			if(sel.includes(u.name)){
				if(current === null) current = u[key];
				else if(current !== u[key]) return Tristate.Mixed;
			}
		}
		return current === 0 ? Tristate.False : Tristate.True;
	}

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

	const getActions = () => {
		if (sel.length === 0) return [
			<Tooltip title={t('common.reload')} key='reload'>
				<span>
					<IconButton edge='end' onClick={props.reload} disabled={props.users === null}>
						<Refresh/>
					</IconButton>
				</span>
			</Tooltip>
		];
		
	}

	return (
		<Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
			<AppBar position='static'>
				<Toolbar>
					<Typography variant='h6'>{sel.length === 0 ? t('users.title') : t('users.countSelected', {count: sel.length})}</Typography>
					<Box sx={{flex: 1}}/>
					{getActions()}
				</Toolbar>
			</AppBar>
			<Box m={2} sx={{flex: 1}}>
				<DataGrid
					columns={columns}
					rows={getRows()}
					loading={props.users === null}
					checkboxSelection
					onSelectionModelChange={(newSel) => setSel(newSel)}
					selectionModel={sel}
				/>
			</Box>
		</Box>
	);
}