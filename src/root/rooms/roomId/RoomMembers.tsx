import { Button, CardActions, CardContent } from "@mui/material";
import { GridColumns, GridValueFormatterParams, DataGrid, GridSelectionModel } from "@mui/x-data-grid";
import { useContext, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { BulkRemoveUsers } from "../../../query/bulk/BulkRemoveUsers";
import { LoginContext } from "../../../storage/LoginInfo";
import { Membership, MembershipEvent, Room } from "../../../types/Room";
import { FullUserID } from "../../../types/Types";

export function RoomMembers(props: {room: Room, states: MembershipEvent[], reload: () => void}){
	
	const {t} = useTranslation();

	const [sel, setSel] = useState<GridSelectionModel>([]);
	const [querying, setQuerying] = useState(false);

	const {homeserver, token} = useContext(LoginContext);

	const columns = useMemo<GridColumns>(
		() => [
			{field: 'username', headerName: t('room.members.username'), flex: 2},
			{field: 'displayName', headerName: t('room.members.displayName'), flex: 1},
			{field: 'invitedBy', headerName: t('room.members.invitedBy'), flex: 2},
			{
				field: 'currentStatus',
				headerName: t('room.members.currentStatus'),
				type: 'singleSelect',
				valueOptions: ['invite', 'knock', 'join', 'leave', 'ban'], 
				flex: 1,
				valueFormatter: (params: GridValueFormatterParams<Membership>) => {
					return t(`room.members.${params.value}`);
				}
			},
			{field: 'joinedAt', headerName: t('room.members.joinedAt'), valueFormatter: (params: GridValueFormatterParams<number>) => {
				if (params.value == null) return '';
				else return new Date(params.value).toLocaleString();
			}, flex: 2},
		],
		[]
	);

	const getRows = () => {
		const rows = [];
		for(const s of props.states){
			rows.push({
				id: s.state_key,
				username: s.state_key,
				displayName: s.content.displayname,
				invitedBy: s.sender,
				currentStatus: s.content.membership,
				joinedAt: s.origin_server_ts
			});
		}
		return rows;
	}

	const remove = async (ban: boolean) => {
		setQuerying(true);
		try{
			const req = new BulkRemoveUsers(homeserver, {rid: props.room.room_id, uid: sel as FullUserID[], reason: 'You are removed from this room by admin.', ban: ban}, token);
			const res = await req.send();
			for(const r of res) if(r instanceof Error) throw r;
			toast.success(t(`room.members.${ban ? 'ban' : 'kick'}Success`, {count: sel.length}));
			props.reload();
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
		} finally {
			setQuerying(false);
		}
	}

	return (
		<>
		<CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
			<DataGrid
				columns={columns}
				rows={getRows()}
				checkboxSelection
				selectionModel={sel}
				onSelectionModelChange={items => {
					if(!querying) setSel(items);
				}}
			/>
		</CardContent>
		<CardActions>
			<Button sx={{ml: 'auto'}} onClick={() => remove(false)} disabled={querying || sel.length === 0}>{t('room.members.kickUsers')}</Button>
			<Button sx={{ml: 'auto'}} onClick={() => remove(true)} disabled={querying || sel.length === 0}>{t('room.members.banUsers')}</Button>
		</CardActions>
		</>
	
	)
}