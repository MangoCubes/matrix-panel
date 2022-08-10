import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
	error: {
		cannotConnect: 'Failed to query Matrix server.'
	},
	login: {
		username: 'Username',
		password: 'Password',
		homeserver: 'Homeserver URL',
		cannotChange: 'This instance does not allow changing homeserver URL.',
		login: 'Login',

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