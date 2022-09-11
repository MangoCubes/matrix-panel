import { AccessTime, AdminPanelSettings, Chat, ManageAccounts, RemoveModerator, SpeakerNotesOff } from "@mui/icons-material";
import { CardContent, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useTranslation } from "react-i18next";
import { User } from "../../../types/User";

enum Status {
	Active = 'active',
	Deactivated = 'deactivated',
	ShadowBanned = 'shadowBanned'
}

enum Type {
	Normal = 'normal',
	Support = 'support',
	Bot = 'bot'
}

export function UserDetails(props: {user: User}){

	const {t} = useTranslation();

	const status = props.user.deactivated ? Status.Deactivated : (props.user.shadow_banned ? Status.ShadowBanned : Status.Active);
	const type = props.user.user_type === null ? Type.Normal : (props.user.user_type === 'bot' ? Type.Bot : Type.Support);

	return (
		<CardContent sx={{flex: 1, display: 'flex', flexDirection: 'column'}}>
			<List>
				<ListItem>
					<ListItemIcon>
						<AccessTime/>	
					</ListItemIcon>
					<ListItemText primary={t('user.details.accountCreatedAt')} secondary={new Date(props.user.creation_ts).toLocaleString()}/>
				</ListItem>
				<ListItem>
					<ListItemIcon>
						{props.user.admin === 1 ? <AdminPanelSettings/> : <RemoveModerator/>}
					</ListItemIcon>
					<ListItemText primary={t('user.details.adminStatus')} secondary={t(`common.${props.user.admin === 1 ? 'yes' : 'no'}`)}/>
				</ListItem>
				<ListItem>
					<ListItemIcon>
						{status === Status.Active ? <Chat/> : <SpeakerNotesOff/>}
					</ListItemIcon>
					<ListItemText primary={t('user.details.accountStatus')} secondary={t(`user.details.${status}`)}/>
				</ListItem>
				<ListItem>
					<ListItemIcon>
						<ManageAccounts/>
					</ListItemIcon>
					<ListItemText primary={t('user.details.accountType')} secondary={t(`user.types.${type}`)}/>
				</ListItem>
			</List>
		</CardContent>
	);
}