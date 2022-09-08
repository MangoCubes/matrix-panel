import { Card, CardContent, Grid, Skeleton, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export function InfoCard(props: {title: string, value: string | null}){

	const {t} = useTranslation();

	return (
		<Grid item xs={12} sm={6} md={3}>
			<Card>
				<CardContent>
					<Typography>{t(props.title)}</Typography>
					<Typography variant='h5'>{props.value === null ? <Skeleton/> : props.value}</Typography>
				</CardContent>
			</Card>
		</Grid>
	)
}