import { Refresh } from "@mui/icons-material";
import { AppBar, Box, Grid, IconButton, Toolbar, Tooltip, Typography } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { GetServerVersionQuery } from "../query/GetServerVersionQuery";
import { LoginContext } from "../storage/LoginInfo";
import { ReloadContext } from "../storage/Reloads";
import { Room } from "../types/Room";
import { User } from "../types/User";
import { InfoCard } from "./InfoCard";

export function Overview(props: {users: User[] | null, rooms: Room[] | null}) {

	const [version, setVersion] = useState<null | string>(null);

	const {t} = useTranslation();

	const con = useRef(new AbortController());

	const {homeserver} = useContext(LoginContext);
	const {reloadAll} = useContext(ReloadContext);

	const getServerVersion = async () => {
		try {
			const req = new GetServerVersionQuery(homeserver, {}, null, con.current);
			const res = await req.send();
			setVersion(res.server.version);
		} catch (e) {
			// What to put here...
		}
	}

	useEffect(() => {
		getServerVersion();
	}, []);

	const getSpaceCount = () => {
		if(props.rooms === null) return null;
		let count = 0;
		for(const r of props.rooms) if(r.room_type === 'm.space') count++;
		return count.toString();
	}

	return (
		<Box sx={{display: 'flex', flexDirection: 'column', height: '100%'}}>
			<AppBar position='static'>
				<Toolbar>
					<Typography variant='h6'>{t('overview.title')}</Typography>
					<Box sx={{flex: 1}}/>
					<Tooltip title={t('common.reload')} key='reload'>
						<span>
							<IconButton onClick={reloadAll} disabled={props.users === null}>
								<Refresh/>
							</IconButton>
						</span>
					</Tooltip>
				</Toolbar>
			</AppBar>
			<Box m={2} sx={{flex: 1}}>
				<Grid
					container
					spacing={2}
					alignItems='flex-start'
					component='div'
				>
					<InfoCard title={'overview.version'} value={version} />
					<InfoCard title={'overview.userCount'} value={props.users === null ? null : props.users.length.toString()} />
					<InfoCard title={'overview.roomCount'} value={props.rooms === null ? null : props.rooms.length.toString()} />
					<InfoCard title={'overview.spaceCount'} value={getSpaceCount()} />
				</Grid>
			</Box>
		</Box>
	);
}