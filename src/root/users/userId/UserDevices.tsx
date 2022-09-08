import { Delete } from "@mui/icons-material";
import { Button, CardActions, CardContent } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColumns, GridRowParams, GridSelectionModel, GridValueFormatterParams } from "@mui/x-data-grid";
import { useState, useRef, useContext, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { DeleteDevicesQuery } from "../../../query/DeleteDevicesQuery";
import { GetUserDevicesQuery } from "../../../query/GetUserDevicesQuery";
import { LoginContext } from "../../../storage/LoginInfo";
import { Device } from "../../../types/Device";
import { DeviceID } from "../../../types/Types";
import { User } from "../../../types/User";

export function UserDevices(props: {user: User, disableTabs: (to: boolean) => void}) {

	const {t} = useTranslation();

	const [reload, setReload] = useState(true);
	const [devices, setDevices] = useState<Device[] | null>(null);
	const [sel, setSel] = useState<GridSelectionModel>([]);
	const [querying, setQuerying] = useState(false);

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
				<GridActionsCellItem icon={<Delete/>} disabled={querying} onClick={() => deleteDevices(p.id as DeviceID)} label={t('common.delete')}/>,
			]}
		],
		[]
	);

	const deleteDevices = async (did?: DeviceID) => {
		let devices: DeviceID[];
		if(did) devices = [did];
		else devices = sel as DeviceID[];
		setQuerying(true);
		try{
			const req = new DeleteDevicesQuery(homeserver, {devices: devices, uid: props.user.name}, token);
			await req.send();
			toast.success(t('user.devices.success', {count: devices.length}));
			setReload(true);
		} catch (e) {
			if (e instanceof Error) {
				const msg = handleCommonErrors(e);
				if (msg) toast.error(t(msg));
			}
		} finally {
			setQuerying(false);
		}
	}

	const getDevices = async () => {
		setDevices(null);
		setReload(false);
		try{
			const req = new GetUserDevicesQuery(homeserver, {uid: props.user.name}, token);
			con.current = req.con;
			const res = await req.send();
			setDevices(res.devices);
		} catch (e) {
			if (e instanceof Error) {
				const msg = handleCommonErrors(e);
				if (msg) toast.error(t(msg));
			}
		}
	}

	useEffect(() => {
		if(reload) getDevices();
	}, [reload]);

	useEffect(() => {
		props.disableTabs(querying);
	}, [querying]);

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
				onSelectionModelChange={items => {
					if(!querying) setSel(items);
				}}
			/>
		</CardContent>
		<CardActions>
			<Button sx={{ml: 'auto'}} color='error' disabled={querying || sel.length === 0} onClick={() => deleteDevices()}>{t('common.delete')}</Button>
		</CardActions>
		</>
	);
}