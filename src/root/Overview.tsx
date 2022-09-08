import { Box, Grid } from "@mui/material";
import { useState } from "react";
import { InfoCard } from "./InfoCard";

export function Overview() {

	const [version, setVersion] = useState<null | string>(null);


	return (
		<Box m={2}>
			<Grid
				container
				spacing={2}
				alignItems='flex-start'
				component='div'
			>
				<InfoCard title={'overview.version'} value={'123'} />
			</Grid>
		</Box>
	);
}