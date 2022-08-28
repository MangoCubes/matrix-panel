import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
	en: {
		translation: {
			common: {
				reload: 'Reload',
				save: 'Save',
				cancel: 'Cancel',
				edit: 'Edit',
				exit: 'Exit',
				delete: 'Delete',
				username: 'Username',
				enabled: 'Enabled',
				disabled: 'Disabled',
				confirm: 'Confirm'
			},
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
				spaces: 'Spaces',
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
				isSpace: 'Is Space?',
				name: 'Name',
				selected: 'Selected {{count}} rooms',
				bulkDeleteTitle: 'Delete {{count}} rooms?',
				bulkDeleteBody: 'You are about to delete {{count}} rooms. This action is not reversible. Are you sure you want to delete them?',
				bulkDelete: 'Successfully deleted {{count}} rooms.',
				bulkPartialDelete: 'Deleted {{success}} rooms, failed to delete {{failed}} rooms.'
			},
			spaces: {
				loadingRooms: 'Loading rooms...',
				loadingSpaces: 'Loading space tree...',
				title: 'View Space Tree'
			},
			room: {
				title: 'Manage Room "{{name}}"',
				invalidRoom: 'That room does not exist.',
				noAlias: '<No Alias>',
				noName: '<Unnamed>',
				details: {
					title: 'Room Details',
					delete: 'Delete Room',
					deleteSuccess: 'Room "{{rid}}" has been deleted successfully.',
					creator: 'Room Creator',
					encryption: 'Encryption',
					history: {
						name: 'History Visibility',
						invited: 'Since they were invited',
						joined: 'Since they joined',
						shared: 'All previous events in this room to members',
						world_readable: 'All previous events in this room to anyone'
					},
					joinRule: {
						name: 'Joining Rule',
						public: 'Anyone can join',
						knock: 'User must request access',
						invite: 'Invite only',
						restricted: 'Restricted'
					},
					parent: 'Parent Space',
					children: {
						name: 'Children Rooms & Spaces',
						value: '{{count}} Rooms & Spaces',
						dialog: {
							title: 'Children Of Room {{rid}}',
							body: 'The following is a list of rooms and spaces that are part of this space.'
						}
					}
				},
				members: {
					title: 'Room Members',
					username: 'Username',
					displayName: 'Display Name',
					invitedBy: 'Invited By',
					currentStatus: 'Current Status',
					joinedAt: 'Joined At',
					ban: 'Banned',
					invite: 'Invited',
					leave: 'Left / Kicked',
					join: 'Joined',
					knock: 'Knocked'
				}
			},
			users: {
				title: 'Manage Users',
				userId: 'User ID',
				isAdmin: 'Admin',
				isGuest: 'Guest',
				avatar: 'Avatar',
				regDate: 'Registered At',
				displayName: 'Display Name',
				deactivated: 'Deactivated',
				shadowBanned: 'Shadow Banned?',
				you: '(You)',
				countSelected: 'Selected {{count}} users',
				deactivate: 'Deactivate selected users',
				activate: 'Activate selected users'
			},
			user: {
				title: 'Manage User "{{name}}"',
				invalidUser: 'That user does not exist.',
				details: {
					title: 'User Details',
					deactivate: {
						title: 'Deactivate user',
						desc: 'Mark a user as deactivated to prevent this account from being used.'
					},
					admin: {
						title: 'Promote To Administrator',
						desc: 'Grant a user administrative privilege, which allows many powerful APIs. Make sure you trust this user.',
						descSelf: 'You cannot demote yourself.',
					},
					
				},
				sessions: {
					title: 'Sessions',
					ip: 'IP',
					lastSeen: 'Last Seen At',
					userAgent: 'User Agent'
				},
				devices: {
					title: 'Devices',
					id: 'Device ID',
					displayName: 'Name',
					lastIp: 'Last Seen IP',
					lastSeenAt: 'Last Seen At',
					success: 'Successfully deleted {{count}} devices.'
				},
				rooms: {
					title: 'Joined Rooms'
				}
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