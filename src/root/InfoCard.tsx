import { Card, CardContent, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export function InfoCard(props: {title: string, value: string}){

	const {t} = useTranslation();

	return (
		<Grid item xs={12} sm={6} md={3}>
			<Card>
				<CardContent>
					<Typography>{t(props.title)}</Typography>
					<Typography variant='h5'>{props.value}</Typography>
				</CardContent>
			</Card>
		</Grid>
	)
}