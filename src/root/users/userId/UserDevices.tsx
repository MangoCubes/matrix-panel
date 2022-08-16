import { Delete } from "@mui/icons-material";
import { Button, CardActions, CardContent } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColumns, GridRowParams, GridSelectionModel, GridValueFormatterParams } from "@mui/x-data-grid";
import { useState, useRef, useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { GetUserDevicesQuery } from "../../../query/GetUserDevicesQuery";
import { LoginContext } from "../../../storage/LoginInfo";
import { Device } from "../../../types/Device";
import { User } from "../../../types/User";

export function UserDevices(props: {user: User}) {

	const {t} = useTranslation();

	const [reload, setReload] = useState(true);
	const [devices, setDevices] = useState<Device[] | null>(null);
	const [sel, setSel] = useState<GridSelectionModel>([]);

	const con = useRef<AbortController | null>(null);

	const {homeserver, token} = useContext(LoginContext);

	const columns = useMemo<GridColumns>(
		() => [
			{field: 'id', headerName: t('user.devices.id'), flex: 2},
			{field: 'displayName', headerName: t('user.devices.displayName'), flex: 2},
			{field: 'lastIp', headerName: t('user.devices.lastIp'), flex: 2},
			{field: 'lastSeenAt', headerName: t('user.devices.lastSeenAt'), valueFormatter: (params: GridValueFormatterParams<number>) => {
				if (params.value == null) return '';
				else return new Date(params.value).toLocaleString()
			}, flex: 2},
			{field: 'actions', type: 'actions', getActions: (p: GridRowParams) => [
				<GridActionsCellItem icon={<Delete/>} onClick={() => {}} label={t('common.delete')}/>,
			]}
		],
		[]
	);

	const getDevices = async () => {
		setDevices(null);
		setReload(false);
		try{
			const req = new GetUserDevicesQuery(homeserver, {uid: props.user.name}, token);
			con.current = req.con;
			const res = await req.send();
			setDevices(res.devices);
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
		}
	}

	useEffect(() => {
		if(reload) getDevices();
	}, [reload]);

	useEffect(() => {
		return () => {
			if(con.current) con.current.abort();
		}
	}, []);

	const getRows = () => {
		if(devices){
			const rows = [];
			for(const d of devices){
				rows.push({
					id: d.device_id,
					displayName: d.display_name,
					lastIp: d.last_seen_ip,
					lastSeenAt: d.last_seen_ts
				});
			}
			return rows;
		} else return [];
	}

	return (
		<>
		<CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
			<DataGrid
				sx={{flex: 1}}
				columns={columns}
				rows={getRows()}
				loading={devices === null}
				checkboxSelection
				selectionModel={sel}
				onSelectionModelChange={items => setSel(items)}
			/>
		</CardContent>
		<CardActions>
			<Button>{t('common.delete')}</Button>
		</CardActions>
		</>
	);
}