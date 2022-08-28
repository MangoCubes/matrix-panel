import { CardContent } from "@mui/material";
import { GridColumns, DataGrid, GridValueFormatterParams } from "@mui/x-data-grid";
import { useRef, useContext, useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import handleCommonErrors from "../../../functions/handleCommonErrors";
import { GetSessionsQuery } from "../../../query/GetSessionsQuery";
import { LoginContext } from "../../../storage/LoginInfo";
import { Session } from "../../../types/Session";
import { User } from "../../../types/User";

export function UserSessions(props: {user: User, disableTabs: (disable: boolean) => void}){

	const con = useRef<AbortController | null>(null);

	const {t} = useTranslation();

	const {homeserver, token} = useContext(LoginContext);

	const [sessions, setSessions] = useState<Session | null>(null);

	const columns = useMemo<GridColumns>(
		() => [
			{field: 'ip', headerName: t('user.sessions.ip'), flex: 1},
			{field: 'lastSeen', headerName: t('user.sessions.lastSeen'), flex: 1, valueFormatter: (params: GridValueFormatterParams<number>) => {
				if (params.value == null) return '';
				else return new Date(params.value).toLocaleString()
			}},
			{field: 'userAgent', headerName: t('user.sessions.userAgent'), flex: 6},
		],
		[]
	);

	const getSessions = async (disableTabs: boolean) => {
		props.disableTabs(disableTabs);
		setSessions(null);
		try{
			const req = new GetSessionsQuery(homeserver, {uid: props.user.name}, token);
			con.current = req.con;
			const res = await req.send();
			setSessions(res.devices[''].sessions[0]);
		} catch (e) {
			if (e instanceof Error) handleCommonErrors(e, t);
		}
	}

	useEffect(() => {
		getSessions(false);
		return () => {
			if(con.current) con.current.abort();
		}
	}, []);

	const getRows = () => {
		if(sessions === null) return [];
		else{
			const list = [];
			for(let i = 0; i < sessions.connections.length; i++){
				const c = sessions.connections[i];
				list.push({
					id: i,
					ip: c.ip,
					lastSeen: c.last_seen,
					userAgent: c.user_agent
				});
			}
			return list;
		}
	}

	return (
		<CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
			<DataGrid
				sx={{flex: 1}}
				columns={columns}
				rows={getRows()}
				loading={sessions === null}
				getRowHeight={() => 'auto'}
			/>
		</CardContent>
	);
}