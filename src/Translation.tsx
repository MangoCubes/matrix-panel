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
				401: 'You are not authorised to do this. Make sure you are admin.',
				403: 'You are not have permission to do this.',
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
				title: 'View Space Tree',
				noSpace: 'No spaces found in this server.'
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
						restricted: 'Restricted',
						mustBeMemberOf: 'Members of {{roomId}} may join'
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
				options: {
					title: 'Room Options',
					request: {
						name: 'Request Room Invitation',
						desc: 'Make room owner send invitation to this account.',
						success: 'Invitation has been sent to your account. You can join the room by accepting it.',
					},
					join: {
						name: 'Join Room',
						desc: 'Join room by accepting invitation sent to you.',
						success: 'You are now member of this room.',
					},
					admin: {
						name: 'Promote to Room Admin',
						desc: 'Give yourself highest permission available in this room. Try this if you are getting invalid permission error.',
						success: 'You are now admin of this room.'
					},
					purge: {
						name: 'Purge History',
						purge: 'Purge',
						desc: 'Delete message history of this room to free up disk space. Note that due to Synapse\'s implementation, most recent message event will not be deleted.',
						success: 'History purge has been initialised. This operation may take a while.',
						dialog: {
							select: 'Purge range',
							all: 'Purge all messages',
							descAll: 'This will delete all messages in this room.',
							until: 'Purge messages until: ',
							choose: 'Choose date & time',
							descUntil: 'This will delete all messages sent between the start of this room to the time specified.',
							notRoomStates: 'Room memberships and other room states will be preserved.'
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
					knock: 'Knocked',
					kickUsers: 'Kick',
					banUsers: 'Ban',
					kickSuccess: 'Successfully kicked {{count}} users from this room.',
					banSuccess: 'Successfully banned {{count}} users from this room.',
					cannotRemoveAdmin: 'You cannot remove room admins.'
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
				options: {
					title: 'Edit User',
					deactivate: {
						title: 'Deactivate user',
						desc: 'Mark a user as deactivated to prevent this account from being used.',
						deactivateSuccess: 'Account successfully deactivated.',
						activateSuccess: 'Account successfully activated.',
						descSelf: 'Mark a user as deactivated to prevent this account from being used. Warning: This account is the one you are currently logged in. Unexpected behaviours are expected if you disable your own account.',
						noPassword: 'You must provide a password for this account in order to reactivate it.'
					},
					admin: {
						title: 'Set As Administrator',
						desc: 'Grant a user administrative privilege, which allows many powerful APIs. Make sure you trust this user.',
						descSelf: 'You cannot demote yourself.',
						adminEnableSuccess: 'This user is now admin.',
						adminDisableSuccess: 'This user is no longer admin.'
					},
					password: {
						dialogTitle: 'Reset Password For User {{uid}}',
						title: 'Set New Password',
						reset: 'Reset',
						desc: 'Reset a user\'s password, and make user log out from all devices. Mandatory for reactivating account.',
						password: 'Password',
						verify: 'Verify',
						empty: 'Password cannot be empty.',
						mismatch: 'Passwords do not match.'
					},
					displayName: {
						title: 'Set Display Name',
						desc: 'Set a name other users will see in a chatroom.',
						displayName: 'Display Name'
					},
					success: 'User details updated successfully.'
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
					title: 'Joined Rooms',
					id: 'Room ID'
				},
				details: {
					title: 'User Details'
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