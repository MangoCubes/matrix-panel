import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
	en: {
		translation: {
			error: {
				cannotConnect: 'Failed to query Matrix server.',
				timeout: 'Server timed out.',
				404: 'Server not found.',
				429: 'You are sending too many requests. Please wait a bit before sending next one.',
				400: 'Request was invalid.',
				401: 'You are not authorised to do this. You may not be admin.',
				unknownRes: 'Received unknown response from the server.',
				unknown: 'Unknown error.',
				missingToken: 'You have been logged out. Please log in again.'
			},
			login: {
				title: 'Sign in to your homeserver',
				username: 'Username',
				password: 'Password',
				homeserver: 'Homeserver URL',
				cannotChange: 'This instance does not allow changing homeserver URL.',
				login: 'Login',
				wrong: 'Wrong username or password.',
				notAdmin: 'You are not admin on this server.',
				success: 'You have successfully logged in as {{name}}.'
			},
			sidebar: {
				reload: 'Reload',
				loggedInto: 'Logged into {{homeserver}}',
				rooms: 'Rooms',
				users: 'Users',
				overview: 'Overview'
			},
			rooms: {
				title: 'Manage Rooms',
				roomId: 'Room ID',
				alias: 'Alias',
				encryption: 'Encryption',
				creator: 'Creator',
				roomType: 'Room Type',
				members: 'Members (Local)',
				isSpace: 'Is It Space?'
			},
			users: {
				title: 'Manage Users',
				userId: 'User ID',
				isAdmin: 'Admin',
				isGuest: 'Guest',
				avatar: 'Avatar',
				regDate: 'Registered At',
				displayName: 'Display Name',
				deactivated: 'Deactivated?',
				shadowBanned: 'Shadow Banned?'
			}
		}
	}
};

i18n.use(initReactI18next).init({resources,
	debug: true,
	fallbackLng: 'en',
	interpolation: {
		escapeValue: false
	}
});

export default i18n;