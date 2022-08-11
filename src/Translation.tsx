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
				unknown: 'Received unknown response from the server.',
				missingToken: 'You have been logged out. Please log in again.'
			},
			login: {
				title: 'Sign in to your homeserver',
				username: 'Username',
				password: 'Password',
				homeserver: 'Homeserver URL',
				cannotChange: 'This instance does not allow changing homeserver URL.',
				login: 'Login',
			},
			sidebar: {
				reload: 'Reload',
				loggedInAs: 'Logged in as {{uid}}'
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