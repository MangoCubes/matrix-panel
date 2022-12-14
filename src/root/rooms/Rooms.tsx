import { Delete, Edit, Refresh } from "@mui/icons-material";
import { AppBar, Box, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColumns, GridRowParams, GridSelectionModel, GridValueFormatterParams } from "@mui/x-data-grid";
import { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import handleCommonErrors from "../../functions/handleCommonErrors";
import { BulkDeleteRooms } from "../../query/bulk/BulkDeleteRooms";
import { LoginContext } from "../../storage/LoginInfo";
import { ReloadContext } from "../../storage/Reloads";
import { Room } from "../../types/Room";
import { RoomID } from "../../types/Types";
import { ConfirmationPopup } from "../popup/ConfirmationPopup";

type MemberCount = {
	all: number;
	local: number;
}

export function Rooms(props: {rooms: Room[] | null}){

	const {t} = useTranslation();
	
	const nav = useNavigate();

	const [sel, setSel] = useState<GridSelectionModel>([]);
	const [querying, setQuerying] = useState(false);
	const [open, setOpen] = useState(false);

	const {homeserver, token} = useContext(LoginContext);
	const {reloadRooms} = useContext(ReloadContext);

	const columns = useMemo<GridColumns>(
		() => [
			{field: 'id', headerName: t('rooms.roomId'), flex: 2},
			{field: 'alias', headerName: t('rooms.alias'), flex: 1},
			{field: 'name', headerName: t('rooms.name'), flex: 1},
			{field: 'encryption', type: 'boolean', headerName: t('rooms.encryption')},
			{field: 'creator', headerName: t('rooms.creator'), flex: 2},
			{field: 'roomType', headerName: t('rooms.roomType'), flex: 1},
			{field: 'members', headerName: t('rooms.members'), valueFormatter: (params: GridValueFormatterParams<MemberCount>) => {
				if (params.value == null) return '';
				else return `${params.value.all} (${params.value.local})`
			}, flex: 1},
			{field: 'isSpace', type: 'boolean', headerName: t('rooms.isSpace')},
			{field: 'actions', type: 'actions', getActions: (p: GridRowParams) => [
				<GridActionsCellItem icon={<Edit/>} onClick={() => nav(`${p.id}`)} label={t('common.edit')}/>,
			]}
		],
		[]
	);

	const getRows = () => {
		if(props.rooms === null) return [];
		const rows = [];
		for(const r of props.rooms){
			rows.push({
				id: r.room_id,
				name: r.name,
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

	const bulkDelete = async () => {
		setQuerying(true);
		try{
			const req = new BulkDeleteRooms(homeserver, {rooms: sel as RoomID[]}, token);
			const res = await req.send();
			let len = res.length;
			for(const r of res) if(r === null) len--;
			if(len === res.length) toast.success(t('rooms.bulkDelete', {count: len}));
			else toast.warn(t('rooms.bulkPartialDelete', {success: len, failed: res.length - len}));
			reloadRooms();
		} catch (e) {
			if (e instanceof Error) {
				const msg = handleCommonErrors(e);
				if (msg) toast.error(t(msg));
			}
		} finally {
			setQuerying(false);
		}
	}

	const getActions = () => {
		if(sel.length === 0) return (
			<Tooltip title={t('common.reload')}>
				<span>
					<IconButton edge='end' onClick={reloadRooms} disabled={props.rooms === null || querying}>
						<Refresh/>
					</IconButton>
				</span>
			</Tooltip>
		);
		else return (
			<>
			<Tooltip title={t('common.delete')}>
				<span>
					<IconButton edge='end' onClick={() => setOpen(true)} disabled={props.rooms === null || querying}>
						<Delete/>
					</IconButton>
				</span>
			</Tooltip>
			<ConfirmationPopup open={open} cancel={() => setOpen(false)} confirm={bulkDelete} title={t('rooms.bulkDeleteTitle', {count: sel.length})} body={t('rooms.bulkDeleteBody', {count: sel.length})}/>
			</>
		);
	}

	return (
		<Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
			<AppBar position='static'>
				<Toolbar>
					<Typography variant='h6'>{sel.length === 0 ? t('rooms.title') : t('rooms.selected', {count: sel.length})}</Typography>
					<Box sx={{flex: 1}}/>
					{getActions()}
				</Toolbar>
			</AppBar>
			<Box m={2} sx={{flex: 1}}>
				<DataGrid
					columns={columns}
					rows={getRows()}
					loading={props.rooms === null}
					checkboxSelection
					selectionModel={sel}
					onSelectionModelChange={items => {
						if(!querying) setSel(items);
					}}
				/>
			</Box>
		</Box>
	);
}