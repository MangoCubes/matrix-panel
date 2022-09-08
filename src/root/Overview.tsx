import { Box, Grid } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { GetServerVersionQuery } from "../query/GetServerVersionQuery";
import { LoginContext } from "../storage/LoginInfo";
import { InfoCard } from "./InfoCard";

export function Overview() {

	const [version, setVersion] = useState<null | string>(null);

	const con = useRef(new AbortController());

	const {homeserver} = useContext(LoginContext);

	const getServerVersion = async () => {
		try {
			const req = new GetServerVersionQuery(homeserver, {}, null, con.current);
			const res = await req.send();
			setVersion(res.server.version);
		} catch (e) {
			// What to put here
		}
	}

	useEffect(() => {
		getServerVersion();
	})

	return (
		<Box m={2}>
			<Grid
				container
				spacing={2}
				alignItems='flex-start'
				component='div'
			>
				<InfoCard title={'overview.version'} value={version} />
			</Grid>
		</Box>
	);
}