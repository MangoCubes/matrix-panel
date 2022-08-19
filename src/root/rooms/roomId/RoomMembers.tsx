import { GridColumns, GridValueFormatterParams, DataGrid } from "@mui/x-data-grid";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Membership, RoomMemberState } from "../../../types/Room";

export function RoomMembers(props: {states: RoomMemberState[]}){
	
	const {t} = useTranslation();

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
				id: s.event_id,
				username: s.state_key,
				displayName: s.content.displayname,
				invitedBy: s.sender,
				currentStatus: s.content.membership,
				joinedAt: s.origin_server_ts
			});
		}
		return rows;
	}

	return <DataGrid columns={columns} rows={getRows()}/>;
}